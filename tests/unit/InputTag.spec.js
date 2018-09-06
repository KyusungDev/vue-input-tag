import { shallowMount } from "@vue/test-utils";
import InputTag from "@/components/InputTag.vue";

function addTag(wrapper, newTag) {
  wrapper.setData({ newTag });
  wrapper.vm.addNew();
}

describe("InputTag.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(InputTag);
  });

  it("should have a new tag input without placeholder", () => {
    const input = wrapper.find("input.new-tag");
    expect(input.attributes().placeholder).toEqual("");
  });

  describe("addNew()", () => {
    beforeEach(() => {
      addTag(wrapper, "tag 1");
      addTag(wrapper, "tag 1");
      addTag(wrapper, "tag 2");
    });

    it("should have 2 tags", () => {
      expect(wrapper.vm.innerTags.length).toEqual(2);
    });

    it("should have a 'tag 1'", () => {
      expect(wrapper.vm.innerTags[0]).toEqual("tag 1");
    });

    it("should have a 'tag 2'", () => {
      expect(wrapper.vm.innerTags[1]).toEqual("tag 2");
    });

    it("should reset the new tag", () => {
      expect(wrapper.vm.newTag).toEqual("");
    });

    it("should emmit a tag change event", () => {
      expect(wrapper.emitted()["update:tags"]).toBeTruthy();
    });

    it("should have 2 remove tag buttons", () => {
      expect(wrapper.findAll("a.remove").length).toEqual(2);
    });
  });

  describe("remove(index)", () => {
    beforeEach(() => {
      addTag(wrapper, "tag 1");
      addTag(wrapper, "tag 2");
      addTag(wrapper, "tag 3");

      wrapper.vm.remove(1);
    });

    it("should have 2 tags", () => {
      expect(wrapper.vm.innerTags.length).toEqual(2);
    });

    it("should have a 'tag 1'", () => {
      expect(wrapper.vm.innerTags[0]).toEqual("tag 1");
    });

    it("should have a 'tag 3'", () => {
      expect(wrapper.vm.innerTags[1]).toEqual("tag 3");
    });
  });

  describe("removeLastTag()", () => {
    beforeEach(() => {
      addTag(wrapper, "tag 1");
      addTag(wrapper, "tag 2");
      addTag(wrapper, "tag 3");

      wrapper.vm.removeLastTag();
    });

    it("should have 2 tags", () => {
      expect(wrapper.vm.innerTags.length).toEqual(2);
    });

    it("should have a 'tag 1'", () => {
      expect(wrapper.vm.innerTags[0]).toEqual("tag 1");
    });

    it("should have a 'tag 2'", () => {
      expect(wrapper.vm.innerTags[1]).toEqual("tag 2");
    });
  });

  describe("Props", () => {
    describe("allow-duplicates='false'", () => {
      beforeEach(() => {
        wrapper = shallowMount(InputTag, {
          propsData: { allowDuplicates: true }
        });
        addTag(wrapper, "tag 1");
        addTag(wrapper, "tag 1");
        addTag(wrapper, "tag 1");
      });

      it("should have 3 tags", () => {
        expect(wrapper.vm.innerTags.length).toEqual(3);
      });

      it("should have a 'tag 1'", () => {
        expect(wrapper.vm.innerTags[2]).toEqual("tag 1");
      });
    });

    describe("read-only='true'", () => {
      beforeEach(() => {
        wrapper = shallowMount(InputTag, {
          propsData: { readOnly: true }
        });

        addTag(wrapper, "tag 1");
      });

      it("should have a read-only CSS class", () => {
        expect(wrapper.findAll(".read-only").length).toEqual(1);
      });

      it("shouldn't have a remove tag button", () => {
        expect(wrapper.findAll("a.remove").length).toEqual(0);
      });

      it("shouldn't have a new input tag", () => {
        expect(wrapper.findAll("input.new-tag").length).toEqual(0);
      });
    });

    describe("tags='[1, 2, 3]'", () => {
      beforeEach(() => {
        wrapper = shallowMount(InputTag, {
          propsData: { tags: [1, 2, 3] }
        });
      });

      it("should have 3 tags", () => {
        expect(wrapper.vm.innerTags.length).toEqual(3);
      });
    });

    describe("validate='text'", () => {
      beforeEach(() => {
        wrapper = shallowMount(InputTag, {
          propsData: { validate: "text" }
        });

        addTag(wrapper, "123");
        addTag(wrapper, "mati@tucci.me");
        addTag(wrapper, "https://tucci.me");
        addTag(wrapper, "2002-04-03");
        addTag(wrapper, "foo");
      });

      it("should have 1 tag", () => {
        expect(wrapper.vm.innerTags.length).toEqual(1);
      });

      it("should have a tag 'foo'", () => {
        expect(wrapper.vm.innerTags[0]).toEqual("foo");
      });
    });

    describe("validate='digits'", () => {
      beforeEach(() => {
        wrapper = shallowMount(InputTag, {
          propsData: { validate: "digits" }
        });

        addTag(wrapper, "mati@tucci.me");
        addTag(wrapper, "https://tucci.me");
        addTag(wrapper, "123");
        addTag(wrapper, "2002-04-03");
        addTag(wrapper, "foo");
      });

      it("should have 1 tag", () => {
        expect(wrapper.vm.innerTags.length).toEqual(2);
      });

      it("should have a tag '123'", () => {
        expect(wrapper.vm.innerTags[0]).toEqual("123");
      });
    });

    describe("validate='email'", () => {
      beforeEach(() => {
        wrapper = shallowMount(InputTag, {
          propsData: { validate: "email" }
        });

        addTag(wrapper, "https://tucci.me");
        addTag(wrapper, "2002-04-03");
        addTag(wrapper, "foo");
        addTag(wrapper, "123");
        addTag(wrapper, "mati@tucci.me");
      });

      it("should have 1 tag", () => {
        expect(wrapper.vm.innerTags.length).toEqual(1);
      });

      it("should have a tag 'mati@tucci.me'", () => {
        expect(wrapper.vm.innerTags[0]).toEqual("mati@tucci.me");
      });
    });

    describe("validate='url'", () => {
      beforeEach(() => {
        wrapper = shallowMount(InputTag, {
          propsData: { validate: "url" }
        });

        addTag(wrapper, "2002-04-03");
        addTag(wrapper, "foo");
        addTag(wrapper, "123");
        addTag(wrapper, "mati@tucci.me");
        addTag(wrapper, "https://tucci.me");
      });

      it("should have 1 tag", () => {
        expect(wrapper.vm.innerTags.length).toEqual(1);
      });

      it("should have a tag 'https://tucci.me'", () => {
        expect(wrapper.vm.innerTags[0]).toEqual("https://tucci.me");
      });
    });

    describe("validate='isodate'", () => {
      beforeEach(() => {
        wrapper = shallowMount(InputTag, {
          propsData: { validate: "isodate" }
        });

        addTag(wrapper, "foo");
        addTag(wrapper, "123");
        addTag(wrapper, "mati@tucci.me");
        addTag(wrapper, "https://tucci.me");
        addTag(wrapper, "2002-04-03");
      });

      it("should have 1 tag", () => {
        expect(wrapper.vm.innerTags.length).toEqual(1);
      });

      it("should have a tag '2002-04-03'", () => {
        expect(wrapper.vm.innerTags[0]).toEqual("2002-04-03");
      });
    });
  });

  describe("CSS classes", () => {
    it("should add activity class when input is focused", () => {
      const vueInputTagWrapper = wrapper.find(".vue-input-tag-wrapper");

      const input = wrapper.find("input.new-tag");
      input.trigger("focus");

      expect(vueInputTagWrapper.classes()).toContain(
        "vue-input-tag-wrapper--active"
      );
    });

    it("should remove activity class when input is blurred", () => {
      const vueInputTagWrapper = wrapper.find(".vue-input-tag-wrapper");

      const input = wrapper.find("input.new-tag");
      input.trigger("focus");
      input.trigger("blur");

      expect(
        vueInputTagWrapper.classes()["vue-input-tag-wrapper--active"]
      ).toBeUndefined();
    });
  });
});
