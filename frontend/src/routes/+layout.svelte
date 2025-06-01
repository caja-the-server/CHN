<script lang="ts">
  import "@unocss/reset/tailwind.css";
  import "virtual:uno.css";
  import "../app.css";

  import Lettermark from "$lib/components/Lettermark.svelte";
  import type { Category } from "$lib/services/category-service";

  const { children, data } = $props();
  const categories: Category[] = [{ id: "all", name: "전체" }, ...data.categories];

  const currentUser = data.currentUser;
  const accountButtons = currentUser
    ? [
        { href: `/@${currentUser.username}`, label: currentUser.name },
        { href: "/signout", label: "로그아웃" },
      ]
    : [{ href: "/signin", label: "로그인" }];

  const date = new Intl.DateTimeFormat("ko-KR", { dateStyle: "full" }).format(new Date());
</script>

<header class="flex-none py-2 sticky top-0 b-b-2 bg-bg b-text">
  <div class="h-8 px-5 py-2 box-content grid grid-cols-[1fr_auto_1fr] font-medium">
    <a class="justify-self-start h-full" href="/">
      <Lettermark />
    </a>
    <nav class="justify-self-center h-full">
      <ul class="h-full flex gap-1 w-max">
        {#each categories as category}
          <li
            class="relative after:(content-empty w-full h-[2px] rounded-full absolute bottom-0 bg-accent duration-100 ease-in-out scale-x-0 hover:scale-x-100)"
          >
            <a class="flex-initial w-max h-full px-2 grid place-items-center" href={category.id}>
              {category.name}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
    <div class="justify-self-end flex gap-2">
      {#each accountButtons as button}
        <a class=" px-4 py-1 b b-line rounded-md hover:bg-hoverbg" href={button.href}>
          {button.label}
        </a>
      {/each}
    </div>
  </div>
</header>
<time class="flex-none w-max my-1 block text-subtext text-xs ml-auto">{date}</time>
<main class="flex-auto">
  {@render children()}
</main>
<footer class="flex-none"></footer>
