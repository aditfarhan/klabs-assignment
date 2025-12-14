import staff from '@/services/staffs'
import auth from '@/services/auth'
import attendance from '@/services/attendance'

const rootServices = {
  reducers: {
    // staff
    [staff.reducerPath]: staff.reducer,
    [auth.reducerPath]: auth.reducer,
    [attendance.reducerPath]: attendance.reducer,
  },
  middlewares: [
    // staff
    staff.middleware,
    auth.middleware,
    attendance.middleware,
  ],
}

export default rootServices
