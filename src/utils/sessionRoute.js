// A session with no planId is a free workout — route accordingly.
export function sessionRoute(session) {
  return session.planId ? `/plans/${session.planId}/session` : '/free-workout';
}
