import { slugify } from './format';

describe('slugify', () => {
  it('ersetzt Umlaute und Sonderzeichen', () => {
    expect(slugify('Großes Fest: Jubiläum 2027 in Fechingen!')).toBe(
      'grosses-fest-jubilaeum-2027-in-fechingen',
    );
  });

  it('entfernt Bindestriche am Rand', () => {
    expect(slugify('  – Hallo –  ')).toBe('hallo');
  });
});
