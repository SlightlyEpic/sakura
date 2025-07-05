// Source: https://github.com/bminer/intel-hex.js
// Rewritten in TS for the browser environment

// Intel Hex record types
export const DATA = 0;
export const END_OF_FILE = 1;
export const EXT_SEGMENT_ADDR = 2;
export const START_SEGMENT_ADDR = 3;
export const EXT_LINEAR_ADDR = 4;
export const START_LINEAR_ADDR = 5;

export const EMPTY_VALUE = 0xFF;

interface ParseResult {
    data: Uint8Array;
    startSegmentAddress: number | null;
    startLinearAddress: number | null;
}

/**
 * Parses an Intel HEX format string into a structured object
 * @param data Intel Hex file (string in ASCII format)
 * @param bufferSize The size of the buffer containing the data (optional).
 *                   Data exceeding the buffer size will be discarded.
 * @param addressOffset Starting address offset (optional).
 *                     Data before the starting address will be discarded.
 * @returns An object containing the parsed data and address information
 * @throws {Error} If the input is malformed or contains invalid data
 */
export function parse(
    data: string,
    bufferSize?: number,
    addressOffset?: number
): ParseResult {
    // Ensure data is a string (no Buffer support in browser)
    if (typeof data !== 'string') {
        throw new Error('Input must be a string in browser environment');
    }

    // Initialization
    const defaultSize = bufferSize || 8192;
    let buf = new Uint8Array(defaultSize);
    let bufLength = 0; // Length of data in the buffer
    let highAddress = 0; // Upper address
    let startSegmentAddress: number | null = null;
    let startLinearAddress: number | null = null;
    addressOffset = addressOffset || 0;
    let lineNum = 0; // Line number in the Intel Hex string
    let pos = 0; // Current position in the Intel Hex string

    const SMALLEST_LINE = 11;
    while (pos + SMALLEST_LINE <= data.length) {
        // Parse an entire line
        if (data.charAt(pos++) !== ':') {
            throw new Error(`Line ${lineNum + 1} does not start with a colon (:).`);
        }
        lineNum++;

        // Number of bytes (hex digit pairs) in the data field
        const dataLength = parseInt(data.substr(pos, 2), 16);
        pos += 2;

        // Get 16-bit address (big-endian)
        const lowAddress = parseInt(data.substr(pos, 4), 16);
        pos += 4;

        // Record type
        const recordType = parseInt(data.substr(pos, 2), 16);
        pos += 2;

        // Data field (hex-encoded string)
        const dataField = data.substr(pos, dataLength * 2);
        const dataFieldBuf = hexStringToUint8Array(dataField);
        pos += dataLength * 2;

        // Checksum
        const checksum = parseInt(data.substr(pos, 2), 16);
        pos += 2;

        // Validate checksum
        let calcChecksum = (dataLength + (lowAddress >> 8) + lowAddress + recordType) & 0xFF;
        for (let i = 0; i < dataLength; i++) {
            calcChecksum = (calcChecksum + dataFieldBuf[i]) & 0xFF;
        }
        calcChecksum = (0x100 - calcChecksum) & 0xFF;
        if (checksum !== calcChecksum) {
            throw new Error(`Invalid checksum on line ${lineNum}: got ${checksum}, but expected ${calcChecksum}`);
        }

        // Parse the record based on its recordType
        switch (recordType) {
            case DATA:
                const absoluteAddress = highAddress + lowAddress - addressOffset;
                // Expand buf if necessary
                if (absoluteAddress + dataLength >= buf.length) {
                    const tmp = new Uint8Array((absoluteAddress + dataLength) * 2);
                    tmp.set(buf.subarray(0, bufLength));
                    buf = tmp;
                }
                // Write over skipped bytes with EMPTY_VALUE
                if (absoluteAddress > bufLength) {
                    buf.fill(EMPTY_VALUE, bufLength, absoluteAddress);
                }
                // Write the dataFieldBuf to buf
                buf.set(dataFieldBuf, absoluteAddress);
                bufLength = Math.max(bufLength, absoluteAddress + dataLength);
                
                // Safely abort if buffer length exceeds size
                if (bufferSize && bufLength >= bufferSize) {
                    return {
                        data: buf.subarray(0, bufLength),
                        startSegmentAddress,
                        startLinearAddress
                    };
                }
                break;

            case END_OF_FILE:
                if (dataLength !== 0) {
                    throw new Error(`Invalid EOF record on line ${lineNum}.`);
                }
                return {
                    data: buf.subarray(0, bufLength),
                    startSegmentAddress,
                    startLinearAddress
                };

            case EXT_SEGMENT_ADDR:
                if (dataLength !== 2 || lowAddress !== 0) {
                    throw new Error(`Invalid extended segment address record on line ${lineNum}.`);
                }
                highAddress = parseInt(dataField, 16) << 4;
                break;

            case START_SEGMENT_ADDR:
                if (dataLength !== 4 || lowAddress !== 0) {
                    throw new Error(`Invalid start segment address record on line ${lineNum}.`);
                }
                startSegmentAddress = parseInt(dataField, 16);
                break;

            case EXT_LINEAR_ADDR:
                if (dataLength !== 2 || lowAddress !== 0) {
                    throw new Error(`Invalid extended linear address record on line ${lineNum}.`);
                }
                highAddress = parseInt(dataField, 16) << 16;
                break;

            case START_LINEAR_ADDR:
                if (dataLength !== 4 || lowAddress !== 0) {
                    throw new Error(`Invalid start linear address record on line ${lineNum}.`);
                }
                startLinearAddress = parseInt(dataField, 16);
                break;

            default:
                throw new Error(`Invalid record type (${recordType}) on line ${lineNum}`);
        }

        // Advance to the next line
        if (data.charAt(pos) === '\r') pos++;
        if (data.charAt(pos) === '\n') pos++;
    }

    throw new Error('Unexpected end of input: missing or invalid EOF record.');
}

// Helper function to convert hex string to Uint8Array
function hexStringToUint8Array(hexString: string): Uint8Array {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return bytes;
}