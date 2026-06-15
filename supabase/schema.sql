-- 物件テーブルの作成
create table properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  rent integer not null,
  area text not null,
  layout text not null,
  created_at timestamptz not null default now()
);

-- RLS（行レベルセキュリティ）を有効化
alter table properties enable row level security;

-- 自分が登録した物件のみ表示できる
create policy "Users can view own properties"
  on properties for select
  using (auth.uid() = user_id);

-- 自分の物件として登録できる
create policy "Users can insert own properties"
  on properties for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
create policy "Users can update own properties"
  on properties for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
create policy "Users can delete own properties"
  on properties for delete
  using (auth.uid() = user_id);

-- ログイン済みユーザーにテーブルへの基本的な操作権限を付与
-- （実際にどの行を操作できるかはRLSポリシーで制御される）
grant select, insert, update, delete on properties to authenticated;
