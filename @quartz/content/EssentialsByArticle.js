import {gql} from '@apollo/client';
import {CollectionPartsFragmentDoc} from './CollectionParts';
import {ObsessionPartsFragmentDoc} from './ObsessionParts';
import {GuidePartsFragmentDoc} from './GuideParts';
import * as Apollo from '@apollo/client';

const defaultOptions = {};
export const EssentialsByArticleDocument = /*#__PURE__*/ gql`
    query EssentialsByArticle($id: ID!) {
        post(id: $id) {
            id
            essentials(first: 3) {
                nodes {
                    ...CollectionParts
                }
            }
            obsessions {
                nodes {
                    ...ObsessionParts
                    essentials(first: 1) {
                        nodes {
                            ...CollectionParts
                        }
                    }
                }
            }
            guides {
                nodes {
                    ...GuideParts
                    essentials(first: 1) {
                        nodes {
                            ...CollectionParts
                        }
                    }
                }
            }
        }
    }
    ${CollectionPartsFragmentDoc}
    ${ObsessionPartsFragmentDoc}
${GuidePartsFragmentDoc}`;

/**
 * __useEssentialsByArticleQuery__
 *
 * To run a query within a React component, call `useEssentialsByArticleQuery` and pass it any options that fit your needs.
 * When your component renders, `useEssentialsByArticleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEssentialsByArticleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEssentialsByArticleQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(EssentialsByArticleDocument, options);
}

export function useEssentialsByArticleLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(EssentialsByArticleDocument, options);
}

//# sourceMappingURL=EssentialsByArticle.js.map