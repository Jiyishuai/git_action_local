create table "public"."abstract" (
    "id" integer generated by default as identity not null,
    "pubmed" integer,
    "abstract" text
);


create table "public"."article" (
    "id" integer generated by default as identity not null,
    "pubmed" integer,
    "title" text,
    "abstract" integer,
    "journal" integer,
    "volume" integer,
    "issue" integer,
    "pages" character varying,
    "doi" character varying,
    "authors" json[],
    "auid" json,
    "keywords" json,
    "mesh" json,
    "received_date" timestamp without time zone,
    "grant_number" character varying,
    "pdf_url" character varying
);


create table "public"."journal" (
    "id" integer generated by default as identity not null,
    "journal" character varying,
    "full_name" character varying,
    "country" character varying,
    "nlm_unique_id" integer,
    "issn_linking" character varying
);


create table "public"."reference" (
    "id" bigint generated by default as identity not null,
    "article" integer,
    "reference" character varying,
    "ref_pmid" integer,
    "ref_pmc" character varying,
    "ref_doi" character varying,
    "ref_ids" json
);


CREATE UNIQUE INDEX abstract_pkey ON public.abstract USING btree (id);

CREATE UNIQUE INDEX article_pkey ON public.article USING btree (id);

CREATE UNIQUE INDEX article_pubmed_key ON public.article USING btree (pubmed);

CREATE UNIQUE INDEX journal_journal_key ON public.journal USING btree (journal);

CREATE UNIQUE INDEX journal_pkey ON public.journal USING btree (id);

CREATE UNIQUE INDEX reference_pkey ON public.reference USING btree (id);

alter table "public"."abstract" add constraint "abstract_pkey" PRIMARY KEY using index "abstract_pkey";

alter table "public"."article" add constraint "article_pkey" PRIMARY KEY using index "article_pkey";

alter table "public"."journal" add constraint "journal_pkey" PRIMARY KEY using index "journal_pkey";

alter table "public"."reference" add constraint "reference_pkey" PRIMARY KEY using index "reference_pkey";

alter table "public"."article" add constraint "article_abstract_fkey" FOREIGN KEY (abstract) REFERENCES abstract(id) ON DELETE SET NULL not valid;

alter table "public"."article" validate constraint "article_abstract_fkey";

alter table "public"."article" add constraint "article_journal_fkey" FOREIGN KEY (journal) REFERENCES journal(id) ON DELETE SET NULL not valid;

alter table "public"."article" validate constraint "article_journal_fkey";

alter table "public"."article" add constraint "article_pubmed_key" UNIQUE using index "article_pubmed_key";

alter table "public"."journal" add constraint "journal_journal_key" UNIQUE using index "journal_journal_key";

alter table "public"."reference" add constraint "reference_article_fkey" FOREIGN KEY (article) REFERENCES article(pubmed) not valid;

alter table "public"."reference" validate constraint "reference_article_fkey";