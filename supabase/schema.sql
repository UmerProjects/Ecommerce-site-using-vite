-- Enable UUID extension if not present
create extension if not exists "uuid-ossp";

-- Profiles table (1-1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger set_timestamp
before update on public.profiles
for each row execute function public.handle_updated_at();

-- Products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'USD',
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create trigger products_set_timestamp
before update on public.products
for each row execute function public.handle_updated_at();

create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_title_trgm_idx on public.products using gin (title gin_trgm_ops);

-- Categories (hierarchical)
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create trigger categories_set_timestamp
before update on public.categories
for each row execute function public.handle_updated_at();

create index if not exists categories_parent_idx on public.categories(parent_id);

-- Product to Category mapping (many-to-many)
create table if not exists public.product_categories (
  product_id uuid references public.products(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

-- Cart items (for authenticated users only)
create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null check (quantity > 0),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (user_id, product_id)
);

create trigger cart_items_set_timestamp
before update on public.cart_items
for each row execute function public.handle_updated_at();

create index if not exists cart_items_user_idx on public.cart_items(user_id);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.product_categories enable row level security;
alter table public.cart_items enable row level security;

-- Profiles: owner can select/insert/update their own row
create policy if not exists "Profiles are viewable by owner" on public.profiles
for select using (auth.uid() = id);

create policy if not exists "Profiles can be inserted by owner" on public.profiles
for insert with check (auth.uid() = id);

create policy if not exists "Profiles can be updated by owner" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

-- Products & categories: read for all; write for service role only
create policy if not exists "Products readable by all" on public.products
for select using (true);

create policy if not exists "Categories readable by all" on public.categories
for select using (true);

create policy if not exists "Product categories readable by all" on public.product_categories
for select using (true);

-- Cart items: only owner can CRUD
create policy if not exists "Cart items owner read" on public.cart_items
for select using (auth.uid() = user_id);

create policy if not exists "Cart items owner insert" on public.cart_items
for insert with check (auth.uid() = user_id);

create policy if not exists "Cart items owner update" on public.cart_items
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "Cart items owner delete" on public.cart_items
for delete using (auth.uid() = user_id);

-- Optional: helpers for search
create extension if not exists pg_trgm;
