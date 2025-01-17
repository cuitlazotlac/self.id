import type { ModelTypeAliases } from '@glazed/types'
import { Core } from '@self.id/core'
import type { CoreModelTypes, CoreParams } from '@self.id/core'
import { dehydrate, QueryClient } from 'react-query'

import { VIEWER_ID_STORAGE_KEY } from './constants'
import type { RequestState } from './types'
import { getCookieValue } from './utils'

export function getCookieViewerID(cookie?: string): string | null {
  return (cookie && getCookieValue(cookie, VIEWER_ID_STORAGE_KEY)) || null
}

export type RequestClientParams<ModelTypes extends ModelTypeAliases = CoreModelTypes> =
  CoreParams<ModelTypes> & { cookie?: string }

/**
 * Extends {@linkcode core.Core}
 *
 * ```sh
 * import { RequestClient } from '@self.id/react'
 * ```
 */
export class RequestClient<
  ModelTypes extends ModelTypeAliases = CoreModelTypes,
  Alias extends keyof ModelTypes['definitions'] = keyof ModelTypes['definitions']
> extends Core<ModelTypes> {
  #queryClient: QueryClient
  #viewerID: string | null

  constructor(params: RequestClientParams<ModelTypes>) {
    super(params)
    this.#queryClient = new QueryClient()
    this.#viewerID = getCookieViewerID(params.cookie)
  }

  get viewerID(): string | null {
    return this.#viewerID
  }

  async prefetch<Key extends Alias>(key: Key, id = this.#viewerID): Promise<boolean> {
    if (id == null) {
      return false
    }
    await this.#queryClient.prefetchQuery([id, key], async () => await this.get(key, id))
    return true
  }

  getState(): RequestState {
    return {
      hydrate: dehydrate(this.#queryClient),
      viewerID: this.#viewerID,
    }
  }
}
