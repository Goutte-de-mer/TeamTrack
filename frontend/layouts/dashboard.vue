<template>
  <main class="flex h-full">
    <SideBar />
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex w-full justify-between gap-x-3.5 px-10 py-6">
        <h1 class="truncate text-lg font-bold uppercase md:text-xl lg:text-3xl">
          <slot name="header-title" />
        </h1>
        <slot name="header-actions" />
      </header>
      <div class="flex-1 bg-[#f6f6f6] px-10 pt-5">
        <slot />
      </div>
    </div>
  </main>
</template>
