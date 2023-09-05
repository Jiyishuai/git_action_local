create extension if not exists "http" with schema "extensions";


alter table "public"."article" alter column "issue" set data type character varying using "issue"::character varying;

alter table "public"."article" alter column "volume" set data type character varying using "volume"::character varying;

alter table "public"."journal" alter column "nlm_unique_id" set data type character varying using "nlm_unique_id"::character varying;

alter table "public"."todos" enable row level security;


