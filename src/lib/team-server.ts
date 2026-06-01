import { cookies } from 'next/headers';
import { getTeamBySlug, type Team } from './teams';

export const TEAM_COOKIE = 'team';

/** The org the user has selected (cookie), defaulting to the Braves. */
export function getSelectedTeam(): Team {
  const slug = cookies().get(TEAM_COOKIE)?.value;
  return getTeamBySlug(slug);
}
