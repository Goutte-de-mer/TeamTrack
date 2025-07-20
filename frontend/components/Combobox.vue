<template>
  <Combobox v-model="internalValue">
    <div class="relative mt-1">
      <div
        class="relative w-full cursor-default overflow-hidden bg-white text-black sm:text-sm"
      >
        <ComboboxInput
          class="focus:border-b-green w-full border-b-2 border-b-gray-200 py-2 pr-10 pl-1 leading-5 transition focus-visible:outline-0"
          :displayValue="(item) => getDisplayText(item)"
          @change="(e) => (query = e.target.value)"
          :placeholder="placeholder"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>
      </div>

      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          <div
            v-if="filteredItems.length === 0 && query !== ''"
            class="relative cursor-default px-4 py-2 text-gray-700 select-none"
          >
            Aucun résultat
          </div>

          <ComboboxOption
            v-for="item in filteredItems"
            :key="getKey(item)"
            :value="item"
            v-slot="{ active }"
          >
            <li
              class="relative cursor-default py-2 pr-4 pl-6 select-none"
              :class="{
                'bg-green text-white': active,
                'text-black': !active,
              }"
            >
              <span class="block truncate">
                {{ getDisplayText(item) }}
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script setup>
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import { ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: { type: [Object, String, Number, null], default: null },
  items: { type: Array, required: true },
  placeholder: { type: String, default: "Sélectionner..." },
  displayField: { type: String, default: "label" },
  keyField: { type: String, default: "_id" },
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);
const query = ref("");

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  },
);

watch(internalValue, (val) => {
  emit("update:modelValue", val);
});

const filteredItems = computed(() => {
  if (!query.value) return props.items;
  return props.items.filter((item) =>
    getDisplayText(item).toLowerCase().includes(query.value.toLowerCase()),
  );
});

function getDisplayText(item) {
  if (!item) return "";
  return typeof item === "string" ? item : (item[props.displayField] ?? "");
}

function getKey(item) {
  return typeof item === "string"
    ? item
    : (item[props.keyField] ?? JSON.stringify(item));
}
</script>
