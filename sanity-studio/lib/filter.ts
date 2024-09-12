import {ReferenceFilterResolverContext} from 'sanity'

export default function filterDocumentsByReferenceDocument({
  document,
  referenceDocumentName,
}: {
  document: ReferenceFilterResolverContext['document']
  referenceDocumentName: string
}) {
  // Fetching the id of the current product
  // while editing a document you are actually editing it's draft
  // drafts have ids starting with "drafts.<id>", so have to strip out "drafts." to get the actual id of the document
  const currentDocumentId = document._id.slice(7)

  return {
    filter: `${referenceDocumentName}._ref == $currentDocumentId`,
    params: {
      currentDocumentId: currentDocumentId,
    },
  }
}
