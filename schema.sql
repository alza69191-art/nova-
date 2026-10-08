-- الصق هذا كله في Supabase > SQL Editor > Run
create table profiles(id uuid primary key references auth.users on delete cascade,name text,daily int default 30,bonus int default 0,last_refill date default current_date,is_admin bool default false);
create table offers(id bigserial primary key,owner uuid default auth.uid(),title text not null,descr text,price numeric,kind text default 'offer',ends_at timestamptz,created_at timestamptz default now());
create table tickets(id bigserial primary key,user_id uuid default auth.uid(),subject text,body text,reply text,seen bool default true,replied_at timestamptz,created_at timestamptz default now());
create table plans(id bigserial primary key,name text,points int,price text,pay_url text);
create function is_admin() returns bool language sql security definer stable as $$select coalesce((select is_admin from profiles where id=auth.uid()),false)$$;
create function new_user() returns trigger language plpgsql security definer as $$begin insert into profiles(id,name) values(new.id,split_part(new.email,'@',1));return new;end$$;
create trigger t after insert on auth.users for each row execute function new_user();
alter table profiles enable row level security;alter table offers enable row level security;alter table tickets enable row level security;alter table plans enable row level security;
create policy a on profiles for select using(id=auth.uid() or is_admin());
create policy b on offers for select using(true);
create policy c on offers for delete using(owner=auth.uid() or is_admin());
create policy d on tickets for select using(user_id=auth.uid() or is_admin());
create policy e on tickets for insert with check(user_id=auth.uid());
create policy f on plans for select using(true);
create policy g on plans for all using(is_admin()) with check(is_admin());
create function refill() returns void language sql security definer as $$update profiles set daily=30,last_refill=current_date where id=auth.uid() and last_refill<current_date$$;
create function create_offer(k text,t text,d text,p numeric,h int) returns void language plpgsql security definer as $$
declare c int;u profiles;
begin
 if auth.uid() is null then raise exception 'login'; end if;
 if k='auction' then h:=least(greatest(coalesce(h,10),1),72); end if;
 c:=case k when 'offer' then 10 when 'market' then 30 when 'auction' then 30+greatest(h-10,0)*2 end;
 if c is null then raise exception 'bad kind'; end if;
 select * into u from profiles where id=auth.uid() for update;
 if u.daily+u.bonus<c then raise exception 'no points'; end if;
 update profiles set daily=greatest(daily-c,0),bonus=bonus-greatest(c-daily,0) where id=u.id;
 insert into offers(title,descr,price,kind,ends_at) values(left(t,120),left(d,1000),p,k,case when k='auction' then now()+make_interval(hours=>h) end);
end$$;
create function admin_reply(i bigint,r text) returns void language plpgsql security definer as $$begin if not is_admin() then raise exception 'x'; end if;update tickets set reply=r,seen=false,replied_at=now() where id=i;end$$;
create function admin_grant(em text,n int) returns void language plpgsql security definer as $$begin if not is_admin() then raise exception 'x'; end if;update profiles set bonus=bonus+n where id=(select id from auth.users where email=em);end$$;
create function mark_seen() returns void language sql security definer as $$update tickets set seen=true where user_id=auth.uid()$$;
alter publication supabase_realtime add table tickets;
-- بعد أن تسجّل حسابك العادي في الموقع، اجعله أدمن (مرة واحدة فقط، من هنا وليس من الكود):
-- update profiles set is_admin=true where id=(select id from auth.users where email='بريدك@example.com');
