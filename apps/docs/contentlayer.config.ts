import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypePrettycode from "rehype-pretty-code";
import { codeOptions } from "next-docs-ui/contentlayer";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeImgSize from "rehype-img-size";

const Docs = defineDocumentType(() => ({
    name: "Docs",
    filePathPattern: `docs/**/*.mdx`,
    contentType: "mdx",
    fields: {
        title: {
            type: "string",
            description: "The title of the document",
            required: true,
        },
        description: {
            type: "string",
            description: "The description of the document",
            required: false,
        },
    },
    computedFields: {
        url: {
            type: "string",
            resolve: (post) => {
                return "/" + post._raw.flattenedPath;
            },
        },
        slug: {
            type: "string",
            resolve: (post) => {
                return post._raw.flattenedPath.split("/").slice(1).join("/");
            },
        },
    },
}));

const Meta = defineDocumentType(() => ({
    name: "Meta",
    filePathPattern: `docs/**/meta.json`,
    contentType: "data",
    fields: {
        title: {
            type: "string",
            description: "The title of the folder",
            required: false,
        },
        pages: {
            type: "list",
            of: {
                type: "string",
            },
            description: "Pages of the folder",
            default: [],
        },
    },
    computedFields: {
        url: {
            type: "string",
            resolve: (post) => "/" + post._raw.sourceFileDir,
        },
    },
}));

export default makeSource({
    contentDirPath: "content",
    documentTypes: [Docs, Meta],
    mdx: {
        rehypePlugins: [
            [rehypePrettycode, codeOptions],
            rehypeSlug,
            [
                rehypeImgSize as any,
                {
                    dir: "./public",
                },
            ],
        ],
        remarkPlugins: [remarkGfm],
    },
});
