import { organizationRepository } from './organization.repository'
import { CreateOrganizationInput } from './organization.schema'
import { AppError } from '../../shared/errors/app-error'

export const organizationService = {
  async create(input: CreateOrganizationInput) {
    const result = await organizationRepository.create(input)
    return result[0]
  },

  async findById(id: string) {
    const org = await organizationRepository.findById(id)
    if (!org) throw new AppError('Organization not found', 404)
    return org
  },
}
