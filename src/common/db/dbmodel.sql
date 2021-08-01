begin;


create table public.authors (
	id serial4 unique not null, 
	name varchar(100),
	email_id varchar(100) unique,
	phone int8,
	eligible_for_premium bool default false, 
	-- nth_article_published_at timestamptz,
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz
) with (oids = false);

create table public.users (
	id serial4 unique not null, 
	name varchar(100),
	email_id varchar(100) unique,
	phone int8,
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz
) with (oids = false);

create table public.followers (
	id serial4 unique not null,
	author_id int4, 
	user_id int4,
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz,
	constraint authorid_fkey foreign key (author_id) references public.authors(id),
	constraint userid_fkey foreign key (user_id) references public.users(id),
	CONSTRAINT user_author_uniq UNIQUE(author_id, user_id) 
) with (oids = false);

create table public.articles (
	id serial4 unique not null,
	author_id int4, 
	title varchar(254),
	description text,
	content text,
	filename text, 
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz,
	constraint authorid_fkey foreign key (author_id) references public.authors(id)
) with (oids = false);


create table public.premium_packages (
	id serial4 unique not null,
	applicable_days int4,
	price int4, 
	description text,
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz
) with (oids = false);

create table public.subscribers (
	id serial4 unique not null,
	author_id int4, 
	user_id int4,
	premium_package_id int4,
	start_date date default CURRENT_DATE not null,
	-- end_date date not null,
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz,
	constraint authorid_fkey foreign key (author_id) references public.authors(id),
	constraint userid_fkey foreign key (user_id) references public.users(id),
	constraint packageid_fkey foreign key (premium_package_id) references public.premium_packages(id)
) with (oids = false);


create table public.subscription_constraints (
	id serial4 unique not null,
	name text, 
	"constraint" int4,
	code varchar(20) unique not null,
	is_active bool default true, 
	created_at timestamptz default now(),
	updated_at timestamptz
) with (oids = false);


commit;


-- drop table subscribers;
-- drop table followers;
-- drop table articles;
-- drop table authors;
-- drop table users;
-- drop table premium_packages ;