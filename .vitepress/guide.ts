export function sidebarGuide() {
  return [
    {
      link: '/guide/intro',
      text: 'Intro',
    },
    {
      link: '/guide/getting-started',
      text: 'Getting Started',
      items: [
        {
          link: '/guide/getting-started/installation',
          text: 'Installation',
        },
        {
          link: '/guide/getting-started/project-structure',
          text: 'Project Structure',
        },
      ],
    },
    {
      link: '/guide/building-your-application',
      text: 'Building Your Application',
      items: [
        {
          link: '/guide/building-your-application/routing',
          text: 'Routing',
          items: [
            {
              link: '/guide/routing/defining-routes',
              text: 'Defining Routes',
            },
            {
              link: '/guide/routing/pages-and-layouts',
              text: 'Pages and Layouts',
            },
            {
              link: '/guide/routing/linking-and-navigating',
              text: 'Linking and Navigating',
            },
            {
              link: '/guide/routing/route-groups',
              text: 'Route Groups',
            },
            {
              link: '/guide/routing/dynamic-routes',
              text: 'Dynamic Routes',
            },
            {
              link: '/guide/routing/loading-ui-and-streaming',
              text: 'Loading UI and Streaming',
            },
            {
              link: '/guide/routing/error-handling',
              text: 'Error Handling',
            },
            {
              link: '/guide/routing/parallel-routes',
              text: 'Parallel Routes',
            },
            {
              link: '/guide/routing/intercepting-routes',
              text: 'Intercepting Routes',
            },
            {
              link: '/guide/routing/route-handlers',
              text: 'Route Handlers',
            },
            {
              link: '/guide/routing/middleware',
              text: 'Middleware',
            },
            {
              link: '/guide/routing/colocation',
              text: 'Project Organization',
            },
            {
              link: '/guide/routing/internationalization',
              text: 'Internationalization',
            },
          ],
        },
        {
          text: 'Data Fetching',
          items: [
            {
              link: '/guide/data-fetching/fetching-caching-and-revalidating',
              text: 'Fetching, Caching, and Revalidating',
            },
            {
              link: '/guide/data-fetching/patterns',
              text: 'Data Fetching Patterns',
            },
            {
              link: '/guide/data-fetching/forms-and-mutations',
              text: 'Forms and Mutations',
            },
          ],
        },
        {
          link: '/guide/building-your-application/rendering',
          text: 'Rendering',
          items: [
            {
              link: '/guide/rendering/server-components',
              text: 'Server Components',
            },
            {
              link: '/guide/rendering/client-components',
              text: 'Client Components',
            },
            {
              link: '/guide/rendering/composition-patterns',
              text: 'Composition Patterns',
            },
            {
              link: '/guide/rendering/edge-and-nodejs-runtimes',
              text: 'Edge and Node.js Runtimes',
            },
          ],
        },
        {
          link: '/guide/building-your-application/caching',
          text: 'Caching',
        },
        {
          link: '/guide/building-your-application/styling',
          text: 'Styling',
          items: [
            {
              link: '/guide/styling/css-modules',
              text: 'CSS Modules',
            },
            {
              link: '/guide/styling/tailwind-css',
              text: 'Tailwind CSS',
            },
            {
              link: '/guide/styling/css-in-js',
              text: 'CSS-in-JS',
            },
            {
              link: '/guide/styling/sass',
              text: 'Sass',
            },
          ],
        },
        {
          link: '/guide/building-your-application/optimizing',
          text: 'Optimizing',
          items: [
            {
              link: '/guide/optimizing/images',
              text: 'Images',
            },
          ],
        },
      ],
    },
  ];
}
