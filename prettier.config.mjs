export default {
    importOrder: ["<THIRD_PARTY_MODULES>", "^~/(.*)$", "^[./]"],
    importOrderSeparation: true,
    printWidth: 120,
    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
}
