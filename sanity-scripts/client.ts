import sanityClient from "@sanity/client"
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";


export const client = sanityClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2022-04-17',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN_EDITOR,
})

const builder = imageUrlBuilder(client);

export const buildUrlFor = (source: SanityImageSource) => builder.image(source)