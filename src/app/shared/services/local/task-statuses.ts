import { Status } from '../../models/status.model';

export function statuses(): Status {
    return {
        current: 'current',
        completed: 'completed',
        holding: 'holding',
        cancelled: 'cancelled'
    }
}
