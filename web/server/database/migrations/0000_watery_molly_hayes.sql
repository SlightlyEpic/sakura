CREATE TABLE "totp" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"otp" char(8) NOT NULL,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "usersRoles" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" varchar(64) NOT NULL,
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"avatar_url" varchar(512),
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"last_login" timestamp DEFAULT now(),
	"verified" boolean DEFAULT false,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "totp" ADD CONSTRAINT "totp_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersRoles" ADD CONSTRAINT "usersRoles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;