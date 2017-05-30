import { ReciclapacPage } from './app.po';

describe('reciclapac App', () => {
  let page: ReciclapacPage;

  beforeEach(() => {
    page = new ReciclapacPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
