import { ref, computed } from 'vue'

export interface ExternalSourceEntry {
  maybeAnnotationSourceGeneticVariantIdentifier: string
  maybeAnnotationSourceGeneticVariantUrl: string
  annotationSourceName: string
}

export interface Variant {
  alleleName: string
  genotype: string
  significance: string
  hgvs: Record<string, string>
  externalSourceEntries: ExternalSourceEntry[]
}

export const significanceOptions = [
  'PATHOGENIC',
  'LIKELY_PATHOGENIC',
  'BENIGN',
  'UNDEFINED',
  'UNCERTAIN',
  'LIKELY_BENIGN'
]

const genotypeMapping: Record<string, string> = {
  'HETEROZYGOTE': 'HETEROZYGOUS',
  'HOMOZYGOTE': 'HOMOZYGOUS'
}

export function useVariantFilter(variantsData: Variant[]) {
  const selectedSignificance = ref<string>('')
  const selectedGenotype = ref<string>('')
  const variantNameFilter = ref<string>('')
  const hgvsFilter = ref<string>('')

  const displayedVariants = ref<Variant[]>([])

  const filteredVariants = computed(() => {
    return variantsData.filter(variant => {
      const matchesSignificance = selectedSignificance.value
        ? variant.significance === selectedSignificance.value
        : true

      const matchesGenotype = selectedGenotype.value
        ? variant.genotype === genotypeMapping[selectedGenotype.value]
        : true

      const matchesVariantName = variantNameFilter.value
        ? variant.alleleName.toLowerCase().includes(variantNameFilter.value.toLowerCase())
        : true

      const matchesHgvs = hgvsFilter.value
        ? Object.values(variant.hgvs).some(hgvs =>
            hgvs && hgvs.toLowerCase().includes(hgvsFilter.value.toLowerCase())
          )
        : true

      return matchesSignificance && matchesGenotype && matchesVariantName && matchesHgvs
    })
  })

  const getSignificanceClass = (significance: string) => {
    switch (significance) {
      case 'PATHOGENIC':
        return 'text-red'
      case 'BENIGN':
        return 'text-green'
      default:
        return ''
    }
  }

  const loadInitialVariants = () => {
    displayedVariants.value = filteredVariants.value.slice(0, 10)
  }

  const filterVariants = () => {
    loadInitialVariants()
  }

  const showAllVariants = computed(() => {
    return displayedVariants.value.length < filteredVariants.value.length
  })

  const showAll = () => {
    displayedVariants.value = filteredVariants.value
  }

  return {
    selectedSignificance,
    selectedGenotype,
    variantNameFilter,
    hgvsFilter,
    displayedVariants,
    filteredVariants,
    getSignificanceClass,
    loadInitialVariants,
    filterVariants,
    showAllVariants,
    showAll
  }
}