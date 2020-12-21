import Bull from 'bull'

export default Bull
export * from './bull.module'
export { Queue, Job } from 'bull'
export { InjectQueue, Process, Processor, getQueueToken } from '@nestjs/bull'
