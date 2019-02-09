import { Component, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('render-text', () => {

  @Component({ tag: 'cmp-a'})
  class CmpA {
    render() {
      return 'Hello World';
    }
  }

  it('Hello World, html option', async () => {
    const { body } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(body).toEqualHtml(`
      <cmp-a class="hydrated">Hello World</cmp-a>
    `);
  });

  it('Hello World, innerHTML, await flush', async () => {
    const { body, flush } = await newSpecPage({
      components: [CmpA]
    });

    body.innerHTML = `<cmp-a></cmp-a>`;
    await flush();

    expect(body).toEqualHtml(`
      <cmp-a class="hydrated">Hello World</cmp-a>
    `);
  });

  it('Hello World, re-render, flush', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() excitement = '';
      render() {
        return `Hello World${this.excitement}`;
      }
    }

    const { root, flush } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a class="hydrated">Hello World</cmp-a>
    `);

    root.excitement = `!`;
    await flush();

    expect(root).toEqualHtml(`
      <cmp-a class="hydrated">Hello World!</cmp-a>
    `);

    root.excitement = `!!`;
    await flush();

    expect(root).toEqualHtml(`
      <cmp-a class="hydrated">Hello World!!</cmp-a>
    `);
  });
});