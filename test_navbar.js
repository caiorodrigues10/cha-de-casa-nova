import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/layout/Navbar.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=90267978"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
const Navbar = ({ user, isAdmin, onLogout, onAdminLoginClick, onAdminLogout }) => /* @__PURE__ */ jsxDEV("nav", { className: "sticky top-0 z-50 bg-[#FAF9F2]/90 backdrop-blur-md border-b border-[#E8E1D1] px-6 py-4 flex justify-between items-center", children: [
  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 bg-[#B59A57] rounded-lg flex items-center justify-center text-white font-serif italic shadow-sm", children: "H" }, void 0, false, {
      fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
      lineNumber: 15,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("h1", { className: "text-xl font-bold text-[#4A4238] tracking-tight hidden sm:block", children: "Nosso Novo Lar" }, void 0, false, {
      fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
      lineNumber: 16,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
    lineNumber: 14,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4", children: [
    user && !isAdmin && /* @__PURE__ */ jsxDEV("span", { className: "hidden md:block text-[#A19A8E] text-[10px] font-bold uppercase tracking-wider", children: [
      "Olá, ",
      user.name.split(" ")[0]
    ] }, void 0, true, {
      fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
      lineNumber: 20,
      columnNumber: 5
    }, this),
    isAdmin && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "hidden sm:flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-[#B59A57] bg-[#B59A57]/10 px-3 py-1.5 rounded-lg border border-[#B59A57]/30", children: [
        /* @__PURE__ */ jsxDEV("span", { children: "🔐" }, void 0, false, {
          fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
          lineNumber: 27,
          columnNumber: 13
        }, this),
        " Admin"
      ] }, void 0, true, {
        fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
        lineNumber: 26,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: onAdminLogout,
          className: "text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-lg font-bold transition bg-[#E8E1D1] text-[#7A7165] hover:bg-[#DED5C3]",
          children: "Sair do Admin"
        },
        void 0,
        false,
        {
          fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
          lineNumber: 29,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
      lineNumber: 25,
      columnNumber: 5
    }, this),
    user && !isAdmin && /* @__PURE__ */ jsxDEV("button", { onClick: onLogout, className: "text-[10px] font-bold text-[#C9A694] hover:text-[#A68574] uppercase tracking-widest", children: "Sair" }, void 0, false, {
      fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
      lineNumber: 39,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
    lineNumber: 18,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx",
  lineNumber: 13,
  columnNumber: 1
}, this);
_c = Navbar;
export default Navbar;
var _c;
$RefreshReg$(_c, "Navbar");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "D:/Programação/cha-de-casa-nova/src/components/layout/Navbar.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBY007QUFITixNQUFNQSxTQUFnQ0EsQ0FBQyxFQUFFQyxNQUFNQyxTQUFTQyxVQUFVQyxtQkFBbUJDLGNBQWMsTUFDakcsdUJBQUMsU0FBSSxXQUFVLDRIQUNiO0FBQUEseUJBQUMsU0FBSSxXQUFVLDJCQUNiO0FBQUEsMkJBQUMsU0FBSSxXQUFVLDJHQUEwRyxpQkFBekg7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUEwSDtBQUFBLElBQzFILHVCQUFDLFFBQUcsV0FBVSxtRUFBa0UsOEJBQWhGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBOEY7QUFBQSxPQUZoRztBQUFBO0FBQUE7QUFBQTtBQUFBLFNBR0E7QUFBQSxFQUNBLHVCQUFDLFNBQUksV0FBVSwyQkFDWko7QUFBQUEsWUFBUSxDQUFDQyxXQUNSLHVCQUFDLFVBQUssV0FBVSxpRkFBZ0Y7QUFBQTtBQUFBLE1BQU1ELEtBQUtLLEtBQUtDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFBQSxTQUE1SDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQThIO0FBQUEsSUFJL0hMLFdBQ0MsdUJBQUMsU0FBSSxXQUFVLDJCQUNiO0FBQUEsNkJBQUMsVUFBSyxXQUFVLHVLQUNkO0FBQUEsK0JBQUMsVUFBSyxrQkFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBQVE7QUFBQSxRQUFPO0FBQUEsV0FEakI7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUVBO0FBQUEsTUFDQTtBQUFBLFFBQUM7QUFBQTtBQUFBLFVBQ0MsU0FBU0c7QUFBQUEsVUFDVCxXQUFVO0FBQUEsVUFBa0k7QUFBQTtBQUFBLFFBRjlJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtBO0FBQUEsU0FURjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBVUE7QUFBQSxJQUdESixRQUFRLENBQUNDLFdBQ1IsdUJBQUMsWUFBTyxTQUFTQyxVQUFVLFdBQVUsdUZBQXNGLG9CQUEzSDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQStIO0FBQUEsT0FyQm5JO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0F1QkE7QUFBQSxLQTVCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BNkJBO0FBQ0FLLEtBL0JJUjtBQWlDTixlQUFlQTtBQUFPLElBQUFRO0FBQUEsYUFBQUEsSUFBQSIsIm5hbWVzIjpbIk5hdmJhciIsInVzZXIiLCJpc0FkbWluIiwib25Mb2dvdXQiLCJvbkFkbWluTG9naW5DbGljayIsIm9uQWRtaW5Mb2dvdXQiLCJuYW1lIiwic3BsaXQiLCJfYyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJOYXZiYXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi8uLi90eXBlcyc7XHJcblxyXG5pbnRlcmZhY2UgTmF2YmFyUHJvcHMge1xyXG4gIHVzZXI6IFVzZXIgfCBudWxsO1xyXG4gIGlzQWRtaW46IGJvb2xlYW47XHJcbiAgb25Mb2dvdXQ6ICgpID0+IHZvaWQ7XHJcbiAgb25BZG1pbkxvZ2luQ2xpY2s6ICgpID0+IHZvaWQ7XHJcbiAgb25BZG1pbkxvZ291dDogKCkgPT4gdm9pZDtcclxufVxyXG5cclxuY29uc3QgTmF2YmFyOiBSZWFjdC5GQzxOYXZiYXJQcm9wcz4gPSAoeyB1c2VyLCBpc0FkbWluLCBvbkxvZ291dCwgb25BZG1pbkxvZ2luQ2xpY2ssIG9uQWRtaW5Mb2dvdXQgfSkgPT4gKFxyXG4gIDxuYXYgY2xhc3NOYW1lPVwic3RpY2t5IHRvcC0wIHotNTAgYmctWyNGQUY5RjJdLzkwIGJhY2tkcm9wLWJsdXItbWQgYm9yZGVyLWIgYm9yZGVyLVsjRThFMUQxXSBweC02IHB5LTQgZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy04IGgtOCBiZy1bI0I1OUE1N10gcm91bmRlZC1sZyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB0ZXh0LXdoaXRlIGZvbnQtc2VyaWYgaXRhbGljIHNoYWRvdy1zbVwiPkg8L2Rpdj5cclxuICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQteGwgZm9udC1ib2xkIHRleHQtWyM0QTQyMzhdIHRyYWNraW5nLXRpZ2h0IGhpZGRlbiBzbTpibG9ja1wiPk5vc3NvIE5vdm8gTGFyPC9oMT5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxyXG4gICAgICB7dXNlciAmJiAhaXNBZG1pbiAmJiAoXHJcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuIG1kOmJsb2NrIHRleHQtWyNBMTlBOEVdIHRleHQtWzEwcHhdIGZvbnQtYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXJcIj5PbMOhLCB7dXNlci5uYW1lLnNwbGl0KCcgJylbMF19PC9zcGFuPlxyXG4gICAgICApfVxyXG5cclxuICAgICAgey8qIEJvdMOjbyBhZG1pbiBzw7MgYXBhcmVjZSBxdWFuZG8gasOhIGVzdMOhIGF1dGVudGljYWRvIGNvbW8gYWRtaW4gKi99XHJcbiAgICAgIHtpc0FkbWluICYmIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4gc206ZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0ZXh0LVs5cHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtWyNCNTlBNTddIGJnLVsjQjU5QTU3XS8xMCBweC0zIHB5LTEuNSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItWyNCNTlBNTddLzMwXCI+XHJcbiAgICAgICAgICAgIDxzcGFuPvCflJA8L3NwYW4+IEFkbWluXHJcbiAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQWRtaW5Mb2dvdXR9XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtWzlweF0gdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0ZXIgcHgtMyBweS0xLjUgcm91bmRlZC1sZyBmb250LWJvbGQgdHJhbnNpdGlvbiBiZy1bI0U4RTFEMV0gdGV4dC1bIzdBNzE2NV0gaG92ZXI6YmctWyNERUQ1QzNdXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgU2FpciBkbyBBZG1pblxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcblxyXG4gICAgICB7dXNlciAmJiAhaXNBZG1pbiAmJiAoXHJcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkxvZ291dH0gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtWyNDOUE2OTRdIGhvdmVyOnRleHQtWyNBNjg1NzRdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3RcIj5TYWlyPC9idXR0b24+XHJcbiAgICAgICl9XHJcbiAgICA8L2Rpdj5cclxuICA8L25hdj5cclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdmJhcjtcclxuIl0sImZpbGUiOiJEOi9Qcm9ncmFtYcOnw6NvL2NoYS1kZS1jYXNhLW5vdmEvc3JjL2NvbXBvbmVudHMvbGF5b3V0L05hdmJhci50c3gifQ==