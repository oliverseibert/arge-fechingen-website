import { EventItem, groupEventsByMonth } from './events.service';

const event = (id: string, starts_at: string): EventItem => ({
  id,
  title: id,
  description: null,
  starts_at,
  ends_at: null,
  location: null,
  category: 'jubilaeum_2027',
  created_at: '',
  updated_at: '',
});

describe('groupEventsByMonth', () => {
  it('gruppiert chronologisch nach Monat mit deutschen Überschriften', () => {
    const groups = groupEventsByMonth([
      event('c', '2027-03-05T18:00:00Z'),
      event('a', '2027-01-10T18:00:00Z'),
      event('b', '2027-01-02T18:00:00Z'),
    ]);
    expect(groups.map((g) => g.label)).toEqual(['Januar 2027', 'März 2027']);
    expect(groups[0].events.map((e) => e.id)).toEqual(['b', 'a']);
  });

  it('verwendet die Zeitzone Europe/Berlin für Monatsgrenzen', () => {
    // 31.01. 23:30 UTC = 01.02. 00:30 in Berlin
    const groups = groupEventsByMonth([event('x', '2027-01-31T23:30:00Z')]);
    expect(groups[0].label).toBe('Februar 2027');
  });
});
