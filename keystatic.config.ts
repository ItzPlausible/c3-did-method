import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'plausiblepotentials',
      name: 'voice',
    },
  },
  
  ui: {
    brand: {
      name: 'Voice | Plausible Potentials',
    },
    navigation: {
      Content: ['posts', 'pages'],
      Settings: ['siteSettings', 'navigation'],
    },
  },

  singletons: {
    siteSettings: singleton({
      label: 'Site Settings',
      path: 'src/content/settings/site',
      schema: {
        siteName: fields.text({
          label: 'Site Name',
          defaultValue: 'Voice | Plausible Potentials',
        }),
        siteDescription: fields.text({
          label: 'Site Description',
          multiline: true,
          defaultValue: 'Sovereignty-first insights from Plausible Potentials Consulting DAO',
        }),
        socialImage: fields.image({
          label: 'Default Social Image',
          directory: 'public/images/social',
          publicPath: '/images/social',
        }),
      },
    }),

    navigation: singleton({
      label: 'Navigation',
      path: 'src/content/settings/navigation',
      schema: {
        mainNav: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            url: fields.text({ label: 'URL' }),
          }),
          {
            label: 'Main Navigation',
            itemLabel: (props) => props.fields.label.value,
          }
        ),
      },
    }),
  },

  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { isRequired: true },
          },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDate: fields.date({
          label: 'Publish Date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({
          label: 'Updated Date',
        }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: 'public/images/posts',
          publicPath: '/images/posts',
        }),
        author: fields.text({
          label: 'Author',
          defaultValue: 'JW',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'C3 Alliance', value: 'c3-alliance' },
            { label: 'Cyber-Mutualism', value: 'cyber-mutualism' },
            { label: 'Cooperative Economics', value: 'cooperative-economics' },
            { label: 'Blockchain Governance', value: 'blockchain-governance' },
            { label: 'Sovereignty', value: 'sovereignty' },
            { label: 'Technical', value: 'technical' },
            { label: 'Announcements', value: 'announcements' },
          ],
          defaultValue: 'announcements',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value,
          }
        ),
        draft: fields.checkbox({
          label: 'Draft',
          defaultValue: false,
          description: 'Draft posts are not published',
        }),
        content: fields.mdx({
          label: 'Content',
          extension: 'mdx',
        }),
      },
    }),

    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { isRequired: true },
          },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        content: fields.mdx({
          label: 'Content',
          extension: 'mdx',
        }),
      },
    }),
  },
});
