import {gql} from '@apollo/client';
import {CollectionPartsFragmentDoc} from './CollectionParts';
import {BulletinDataPartsFragmentDoc} from './BulletinDataParts';
import * as Apollo from '@apollo/client';

const defaultOptions = {};
export const EssentialsByCollectionDocument = /*#__PURE__*/ gql`
    query EssentialsByCollection($collectionId: Int!) {
        collectionBy(collectionId: $collectionId) {
            ...CollectionParts
            bulletin {
                ...BulletinDataParts
            }
        }
    }
    ${CollectionPartsFragmentDoc}
${BulletinDataPartsFragmentDoc}`;

/**
 * __useEssentialsByCollectionQuery__
 *
 * To run a query within a React component, call `useEssentialsByCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useEssentialsByCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEssentialsByCollectionQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *   },
 * });
 */
export function useEssentialsByCollectionQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(EssentialsByCollectionDocument, options);
}

export function useEssentialsByCollectionLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(EssentialsByCollectionDocument, options);
}

//# sourceMappingURL=EssentialsByCollection.js.map