; Simple AVR Assembly program to demonstrate register manipulation in a loop
; Target: Any AVR microcontroller (e.g., ATmega328P)
; This program counts from 0 to 255, adds a value to another register, and loops

.device ATmega328P    ; Define the target device (can be changed based on your MCU)

; Register definitions for clarity
.def counter = r16    ; Register r16 will be our counter
.def temp = r17       ; Register r17 will be used for temporary storage

.org 0x0000           ; Start program at address 0 (reset vector)
    rjmp start        ; Jump to the start of the program

start:
    ldi counter, 0    ; Load immediate value 0 into counter (r16)
    ldi temp, 10      ; Load immediate value 10 into temp (r17)

loop:
    inc counter       ; Increment the counter (r16)
    add temp, counter ; Add counter value to temp (r17)
    cpi counter, 255  ; Compare counter with 255
    brne loop         ; Branch to loop if counter != 255 (Zero flag not set)

end:
    rjmp end          ; Infinite loop to end the program
