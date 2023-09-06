import babel from "vite-plugin-babel";
import {defineConfig} from "vite";

export default defineConfig({
    base: './',
    plugins: [
        babel()
        // 其他插件...
    ],
    build: {
        target: 'es2015'
    }
})