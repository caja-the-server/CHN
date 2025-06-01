<script>
  import { goto } from "$app/navigation";
  import { signout } from "$lib/services/auth-service";
</script>

<button
  class="px-4 py-1 m-auto b-1 b-line rounded-md font-medium hover:bg-hoverbg"
  onclick={async () => {
    await signout(fetch);
    goto("/");
  }}
>
  로그아웃
</button>
