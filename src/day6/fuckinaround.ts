type ResourceArray<K> = Array<{ resource: K, getResource: () => K }>

type Person = {
  firstName: string
}

const a: ResourceArray<Person>= [
  {
    resource: { firstName: 'asa' },
    getResource: () => {
      return null
    }
  },
]

function takesResourceArray(p1: ResourceArray<Person>) {
  return null
}

takesResourceArray(a)
