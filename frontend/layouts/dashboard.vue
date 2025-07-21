<template>
  <main class="flex">
    <SideBar />
    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <header class="flex w-full justify-between gap-x-3.5 px-10 py-6">
        <h1 class="truncate text-lg font-bold uppercase md:text-xl lg:text-2xl">
          <slot name="header-title" />
        </h1>
        <slot name="header-actions" />
      </header>
      <div class="flex-1 bg-[#f6f6f6] px-10 py-5">
        <slot />
      </div>
    </div>
  </main>
</template>
