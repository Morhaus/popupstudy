import { gql } from 'react-apollo';

const findTagsQuery = gql`
  query findTags($tags: [String!]) {
    tags: allTags(filter: {
      name_in: $tags
    }) {
      id
      name
    }
  }
`;

const createTagMutation = gql`
  mutation createTagMutation($name: String!) {
    createTag(name: $name) {
      id
      name
    }
  }
`;

export default async function findOrCreateTags(client, tags) {
  const { data } = await client.query({
    query: findTagsQuery,
    variables: {
      tags,
    },
  });

  const foundTags = data.tags;
  const existingTags = foundTags.map(tag => tag.name);
  const tagsToCreate = tags.filter(tag => !existingTags.includes(tag));

  let results;
  if (tagsToCreate.length > 0) {
    const promises = tagsToCreate.map(tag =>
      client.mutate({
        mutation: createTagMutation,
        variables: { name: tag },
      })
    );

    results = await Promise.all(promises);
  }

  const resultTags = tags.map(tag => {
    const idx = existingTags.indexOf(tag);
    if (idx !== -1) {
      return foundTags[idx];
    }
    return results[tagsToCreate.indexOf(tag)].data.createTag;
  });

  return resultTags;
}
