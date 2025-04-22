import {defineConfig} from "vite";

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: "popup.html",
                applied: "src/applied.ts",
                jobs: "src/jobs.ts",
            },
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: '[name].js',
                assetFileNames: '[name][extname]',
            },
        },
    }
});
