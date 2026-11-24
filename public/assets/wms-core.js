function E(e){return e==null||isNaN(e)?"0 \u20AB":Math.round(e).toLocaleString("vi-VN")+" \u20AB"}function Ht(e){if(e==null||isNaN(e))return{val:"\u2014",unit:"",full:"\u2014"};let n=Number(e),a=Math.abs(n),t=n<0?"-":"",o=n.toLocaleString("vi-VN")+" \u20AB";if(a>=1e9){let s=(a/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:t+s,unit:"t\u1EF7 \u20AB",full:o}}else if(a>=1e6){let s=(a/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:t+s,unit:"tr \u20AB",full:o}}else return{val:t+a.toLocaleString("vi-VN"),unit:"\u20AB",full:o}}function Fr(e){if(!e)return"\u2014";if(typeof e=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e.trim()))return e.trim();try{let n=new Date(e);if(isNaN(n.getTime()))return String(e);let a=n.getFullYear(),t=String(n.getMonth()+1).padStart(2,"0"),o=String(n.getDate()).padStart(2,"0");return`${a}-${t}-${o}`}catch{return String(e)}}function Y(e){if(!e)return"\u2014";try{let n=new Date(e);if(isNaN(n.getTime()))return String(e);let a=String(n.getDate()).padStart(2,"0"),t=String(n.getMonth()+1).padStart(2,"0"),o=n.getFullYear();return`${a}/${t}/${o}`}catch{return String(e)}}function T(e,n=1){return e==null||isNaN(e)?"0":Number(e).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:n})}function b(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function Ar(e,n=200){let a=null;return function(...t){a&&clearTimeout(a),a=setTimeout(()=>{e.apply(this,t)},n)}}function Nt(e){if(!e)return"U";try{let a=e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").trim().split(/\s+/).filter(Boolean);return a.length===0?"U":a.length===1?a[0].substring(0,2).toUpperCase():(a[0][0]+a[a.length-1][0]).toUpperCase()}catch{return"U"}}var Ft=class{cache=new Map;defaultTtl=3e4;async get(n,a=this.defaultTtl){let t=Date.now(),o=this.cache.get(n);if(o&&t-o.timestamp<a)return t-o.timestamp>1e4&&fetch(n).then(s=>s.json()).then(s=>{s.success&&this.cache.set(n,{timestamp:Date.now(),data:s})}).catch(()=>{}),o.data;try{let r=await(await fetch(n)).json();return r.success&&this.cache.set(n,{timestamp:t,data:r}),r}catch(s){return{success:!1,error:s instanceof Error?s.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(n,a){this.cache.clear();try{return await(await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).json()}catch(t){return{success:!1,error:t instanceof Error?t.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(n){if(!n){this.cache.clear();return}for(let a of this.cache.keys())a.includes(n)&&this.cache.delete(a)}async getPoList(n,a="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(n)}&status=${encodeURIComponent(a)}`)}async getPoDetails(n){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(n)}`)}async getReceiptHistory(n){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(n)}`)}async getInventory(n){return this.get(`/api/wh/inventory?site=${encodeURIComponent(n)}`)}async submitManualReceipt(n){return this.post("/api/fnb/manual-receipt",n)}},Rr=new Ft;function W(){let e=localStorage.getItem("orbit_user_site");if(e)return e.toUpperCase();let n=window,a=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():"K001";return a==="ALL"||!a?"K001":a}function le(e){if(!e||e==="\u2014")return"\u2014";let n=String(e).trim(),a=n.match(/^(\d{4})-(\d{2})-(\d{2})/);if(a)return`${a[1]}-${a[2]}-${a[3]}`;try{let t=new Date(n);if(!isNaN(t.getTime())){let o=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0");return`${o}-${s}-${r}`}}catch{}return n.slice(0,10)}function O(e){if(!e)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let n=new Date;n.setHours(0,0,0,0);let a=new Date(e);a.setHours(0,0,0,0);let t=Math.ceil((a.getTime()-n.getTime())/(1e3*60*60*24));return t<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(t)} ng\xE0y)</span>`:t===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':t<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${t} ng\xE0y)</span>`:t<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${t} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${t} ng\xE0y</span>`}function xe(e){window.gFnbReceiptCurrentView=e;let n=document.getElementById("fnbReceiptTabBtnPo"),a=document.getElementById("fnbReceiptTabBtnHistory"),t=document.getElementById("fnbPoListView"),o=document.getElementById("fnbReceiptHistoryView");e==="po"?(n&&(n.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),a&&(a.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),t&&t.classList.remove("hidden"),o&&o.classList.add("hidden"),ce()):(a&&(a.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),o&&o.classList.remove("hidden"),t&&t.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function jn(e){let n=e||W(),a=document.getElementById("fnbReceiptFilterSite");a&&(a.value=n);let o=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(i=>i.code.toUpperCase()===n.toUpperCase()),s=o?o.ten||o.name:n,r=document.getElementById("fnbReceiptCurrentSiteBadge");r&&(r.textContent=s),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(n):await ce(n)}function Vn(e){tt(e)}async function ce(e){let n=e||W(),a=document.getElementById("fnbPoStatusFilter"),t=a?a.value:"OPEN",o=document.getElementById("fnbPoSummaryText");try{o&&(o.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${n}...`);let r=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(n)}&status=${encodeURIComponent(t)}&no-cache=1`)).json();if(r.success&&r.data){window.gFnbPoList=r.data;let i=document.getElementById("fnbPoSearchInput")?.value||"";tt(i);let l=(window.gFnbPoList||[]).filter(c=>c.status==="OPEN").length,d=document.getElementById("fnbReceiptBadgePendingCount");d&&(d.textContent=String(l))}else throw new Error(r.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(s){console.error("loadFnbPoList error:",s),o&&(o.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+s.message)}}function tt(e=""){let n=document.getElementById("fnbPoTableBody"),a=document.getElementById("fnbPoMobileCards"),t=document.getElementById("fnbPoSummaryText"),o=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),s=(e||"").toLowerCase().trim(),r=window.gFnbPoList||[];o&&(r=r.filter(i=>{let l=(i.supplier_name||"").toLowerCase();return o==="siba"?l.includes("siba")||l.includes("b\u1EBFp trung t\xE2m")||l.includes("trung t\xE2m"):o==="baf"?l.includes("baf")||l.includes("th\u1ECBt"):o==="spice"?l.includes("gia v\u1ECB")||l.includes("\u0111\u01B0\u1EDDng")||l.includes("unilever")||l.includes("cholimex")||l.includes("mu\u1ED1i"):o==="veg"?l.includes("rau")||l.includes("\u0111\xE0 l\u1EA1t")||l.includes("c\u1EE7"):!0})),s&&(r=r.filter(i=>{let l=(i.po_number||"").toLowerCase(),d=(i.supplier_name||"").toLowerCase(),c=(i.supplier_code||"").toLowerCase();return l.includes(s)||d.includes(s)||c.includes(s)})),t&&(t.textContent=`Hi\u1EC3n th\u1ECB ${r.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),n&&(r.length===0?n.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':n.innerHTML=r.map(i=>{let l=i.status==="OPEN",d=i.status==="COMPLETED",c=d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':l?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',f=(i.po_number||"").startsWith("50000")||!i.supplier_code||i.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',h=Number(i.total_amount)||0,g=Number(i.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${b(i.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${b(le(i.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${f}
                <span class="font-medium text-gray-900 dark:text-white">${b(i.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${i.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${b(i.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${i.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${g.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${h>0?Math.round(h).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${c}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${b(i.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${d?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${d?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${d?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),a&&(r.length===0?a.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':a.innerHTML=r.map(i=>{let l=i.status==="COMPLETED",d=(i.po_number||"").startsWith("50000")||!i.supplier_code||i.supplier_name==="B\u1EBFp Trung T\xE2m Siba",c=Number(i.total_amount)||0,u=Number(i.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${d?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${d?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${b(i.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${b(i.po_number)} \u2022 ${b(le(i.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${l?"text-emerald-600":"text-amber-600"} block">${l?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${i.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${u.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${c>0?Math.round(c).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${b(i.po_number)}')" class="w-full py-2 rounded-xl ${l?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${l?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${l?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function At(e){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+e+"...");let a=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(e)}&no-cache=1`)).json();if(!a.success||!a.data)throw new Error(a.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let t=a.data;if(!t.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let o=t[0],s=document.getElementById("receiptModalInvoice"),r=document.getElementById("receiptModalInvoiceDisplay"),i=document.getElementById("receiptModalSite"),l=document.getElementById("receiptModalSiteDisplay"),d=document.getElementById("receiptModalSupplier"),c=document.getElementById("receiptModalSupplierDisplay"),u=document.getElementById("receiptModalDate"),f=new Date().toISOString().slice(0,10);s&&(s.value=o.po_number),r&&(r.textContent=o.po_number),i&&(i.value=o.site),l&&(l.textContent=o.site),d&&(d.value=o.supplier_name),c&&(c.textContent=o.supplier_name),u&&(u.value=f);let h="L\xD4-"+f.replace(/-/g,"").slice(2),g=new Date;g.setFullYear(g.getFullYear()+1);let p=g.toISOString().slice(0,10);window.gReceiptLines=t.map(y=>{let x=(y.merch_category||"").toLowerCase(),w=!x.includes("bao b\xEC")&&!x.includes("c\xF4ng c\u1EE5")&&!x.includes("h\xF3a ch\u1EA5t")&&!x.includes("t\u1EA1p ph\u1EA9m");return{po_item:y.po_item,item_code:y.item_code,item_name:y.item_name,merch_category:y.merch_category,unit:y.unit||"KG",unit_price:Number(y.unit_price)||0,order_qty:Number(y.order_qty)||0,actual_qty:Number(y.order_qty)||0,batch_code:h,exp_date:w?p:"",is_food:w,note:""}}),Dt();let m=document.getElementById("createReceiptModal");m&&m.classList.remove("hidden")}catch(n){console.error("openPoReceiptModal error:",n),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Dt(){let e=document.getElementById("receiptLinesTableBody"),n=document.getElementById("receiptLinesMobileCards"),a=document.getElementById("receiptModalLineCount"),t=document.getElementById("receiptModalTotalAmount"),o=window.gReceiptLines||[];a&&(a.textContent=String(o.length));let s=0;e&&(e.innerHTML=o.map((r,i)=>{let l=(r.actual_qty||0)*(r.unit_price||0);return s+=l,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${i+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${b(r.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${b(r.item_code)}</span>
              ${r.merch_category?`<span>\u2022</span><span>${b(r.merch_category)}</span>`:""}
              ${r.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${b(r.unit||"")}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300">
            ${Number(r.unit_price).toLocaleString("vi-VN")} \u0111
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
            ${Number(r.order_qty).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" step="0.01" min="0" value="${r.actual_qty}" 
                   oninput="onReceiptLineQtyChange(${i}, this.value)" 
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="text" value="${b(r.batch_code||"")}" placeholder="L\xF4 SX..." 
                   oninput="onReceiptLineBatchChange(${i}, this.value)" 
                   class="w-28 text-center py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex flex-col items-center">
              <input type="date" id="receiptLineExpInput_${i}" value="${r.exp_date||""}" 
                     onchange="onReceiptLineExpChange(${i}, this.value)" 
                     class="w-32 py-1 px-1.5 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <div class="flex items-center gap-1 mt-1">
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 1)" title="+1 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 6)" title="+6 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 12)" title="+1 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 24)" title="+2 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+2N</button>
              </div>
              <div id="receiptExpWarning_${i}" class="mt-1">
                ${O(r.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${i}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${l>0?Math.round(l).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${b(r.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${i}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=o.map((r,i)=>{let l=(r.actual_qty||0)*(r.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${b(r.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${b(r.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${b(r.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(r.unit_price).toLocaleString("vi-VN")} \u0111</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">#${i+1}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl text-center tabular-nums text-xs">
            <div>
              <span class="text-gray-400 block text-[11px]">SL \u0110\u1EB7t SAP:</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">${Number(r.order_qty).toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Th\xE0nh ti\u1EC1n:</span>
              <span id="receiptLineTotalMob_${i}" class="num font-bold text-brand-600 dark:text-brand-400">${l>0?Math.round(l).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Ph\xE2n lo\u1EA1i:</span>
              <span class="text-xs font-medium">${r.is_food?"Th\u1EF1c ph\u1EA9m":"V\u1EADt t\u01B0"}</span>
            </div>
          </div>

          <div class="space-y-2 pt-1 text-xs">
            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">SL th\u1EF1c nh\u1EADp:</label>
              <input type="number" step="0.01" min="0" value="${r.actual_qty}" 
                     oninput="onReceiptLineQtyChange(${i}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center">
            </div>

            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">S\u1ED1 l\xF4 (Batch):</label>
              <input type="text" value="${b(r.batch_code||"")}" placeholder="L\xF4 SX..." 
                     oninput="onReceiptLineBatchChange(${i}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">H\u1EA1n d\xF9ng (EXP):</label>
                <input type="date" id="receiptLineExpInputMob_${i}" value="${r.exp_date||""}" 
                       onchange="onReceiptLineExpChange(${i}, this.value)" 
                       class="flex-1 py-1 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 outline-none">
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <span class="text-[11px] text-gray-400">Ch\u1ECDn nhanh:</span>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 1)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 6)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 12)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${i}, 24)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+2N</button>
              </div>
              <div id="receiptExpWarningMob_${i}" class="mt-1">
                ${O(r.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${b(r.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${i}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),t&&(t.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function Un(e,n){if(!window.gReceiptLines||!window.gReceiptLines[e])return;let a=parseFloat(n);window.gReceiptLines[e].actual_qty=isNaN(a)?0:a;let t=window.gReceiptLines[e],o=(t.actual_qty||0)*(t.unit_price||0),s=document.getElementById(`receiptLineTotal_${e}`);s&&(s.textContent=o>0?Math.round(o).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let r=document.getElementById(`receiptLineTotalMob_${e}`);r&&(r.textContent=o>0?Math.round(o).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let i=0;window.gReceiptLines.forEach(d=>{i+=(d.actual_qty||0)*(d.unit_price||0)});let l=document.getElementById("receiptModalTotalAmount");l&&(l.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function Wn(e,n){!window.gReceiptLines||!window.gReceiptLines[e]||(window.gReceiptLines[e].batch_code=n)}function Kn(e,n){if(!window.gReceiptLines||!window.gReceiptLines[e])return;window.gReceiptLines[e].exp_date=n;let a=document.getElementById(`receiptExpWarning_${e}`);a&&(a.innerHTML=O(n));let t=document.getElementById(`receiptExpWarningMob_${e}`);t&&(t.innerHTML=O(n)),window.lucide&&window.lucide.createIcons()}function Gn(e,n){if(!window.gReceiptLines||!window.gReceiptLines[e])return;let a=new Date;a.setMonth(a.getMonth()+n);let t=a.toISOString().slice(0,10);window.gReceiptLines[e].exp_date=t;let o=document.getElementById(`receiptLineExpInput_${e}`);o&&(o.value=t);let s=document.getElementById(`receiptLineExpInputMob_${e}`);s&&(s.value=t);let r=document.getElementById(`receiptExpWarning_${e}`);r&&(r.innerHTML=O(t));let i=document.getElementById(`receiptExpWarningMob_${e}`);i&&(i.innerHTML=O(t)),window.lucide&&window.lucide.createIcons()}function Xn(e,n){!window.gReceiptLines||!window.gReceiptLines[e]||(window.gReceiptLines[e].note=n)}function Rt(){let e=document.getElementById("createReceiptModal");e&&e.classList.add("hidden")}function qn(){window.gFnbPoList&&window.gFnbPoList.length?At(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function zn(){let n=(window.gReceiptLines||[]).filter(f=>(f.actual_qty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let a=new Date;a.setHours(0,0,0,0);let t=!1;for(let f of n)if(f.exp_date){let h=new Date(f.exp_date);if(h.setHours(0,0,0,0),h<=a){t=!0;break}}if(t&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let o=document.getElementById("receiptModalSite")?.value||W(),s=document.getElementById("receiptModalInvoice")?.value||"",r=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),i=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",l=document.getElementById("receiptModalNotes")?.value||"",d=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",c={site_code:o,receipt_date:r,supplier:i,invoice_no:s,notes:l,created_by:d,lines:n.map(f=>({item_code:f.item_code,qty:f.actual_qty,unit_price:f.unit_price,batch_code:(f.batch_code||"").trim(),exp_date:(f.exp_date||"").trim()||null,note:f.note||""}))},u=document.getElementById("btnSubmitReceipt");u&&(u.disabled=!0,u.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let h=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)})).json();if(!h.success)throw new Error(h.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${h.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${o} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Rt(),await ce(o),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(o),xe("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(f){console.error("submitCreateReceipt error:",f),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+f.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),u&&(u.disabled=!1,u.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function Qn(e){let n=e||W(),a=document.getElementById("fnbReceiptsTableBody"),t=document.getElementById("fnbReceiptsMobileCards");try{let s=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(n)}&no-cache=1`)).json();if(s.success&&s.data){let r=s.data.receipts||[],i=document.getElementById("fnbReceiptBadgeHistoryCount");i&&(i.textContent=String(r.length)),a&&(r.length?a.innerHTML=r.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${b(l.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${b(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${b(le(l.receipt_date))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${b(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</td>
              <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${b(l.invoice_no||"\u2014")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-3 px-3 text-gray-500 text-xs">${b(l.created_by||"Th\u1EE7 kho")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewReceiptDetail(${l.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):a.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${b(n)}.</td></tr>`),t&&(r.length?t.innerHTML=r.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${b(l.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${b(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${b(le(l.receipt_date))} \u2022 PO: ${b(l.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${b(l.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):t.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(o){console.error("loadFnbReceiptsHistory error:",o)}}async function Jn(e){try{typeof window.showLoading=="function"&&window.showLoading();let a=await(await fetch(`/api/fnb/receipts?id=${e}`)).json();if(!a.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let t=a.data.lines||[],o=document.getElementById("invDetailModal"),s=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");s&&(s.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${e}`),r&&(r.textContent=`${t.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let i=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-2 text-center">\u0110VT</th>
              <th class="py-2 px-3 text-right">SL Nh\u1EADp</th>
              <th class="py-2 px-3 text-center whitespace-nowrap min-w-[100px]">M\xE3 L\xF4 SX</th>
              <th class="py-2 px-3 text-center whitespace-nowrap min-w-[110px]">H\u1EA1n D\xF9ng (EXP)</th>
              <th class="py-2 px-3 text-right">\u0110\u01A1n Gi\xE1</th>
              <th class="py-2 px-3 text-right">Th\xE0nh Ti\u1EC1n</th>
              <th class="py-2 px-3">Ghi Ch\xFA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${t.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${b(d.item_name||d.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${b(d.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(d.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${b(d.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${d.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${b(d.exp_date?String(d.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(d.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(d.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${b(d.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=i),o&&o.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function Yn(e){let n=e||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||W()||"K001",t=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(m=>m.code.toUpperCase()===n.toUpperCase()),o=t?t.ten||t.name:n,s=o.startsWith(n)?o:`${n} - ${o}`,r=document.getElementById("manualReceiptSiteNameDisplay");r&&(r.textContent=s);let i=document.getElementById("manualReceiptSiteSelect");i&&(i.value=n);let l=document.getElementById("manualReceiptSiteBadge");l&&(l.textContent=n);let d=document.getElementById("manualReceiptDate");d&&(d.value=new Date().toISOString().slice(0,10));let c=document.getElementById("manualReceiptSupplier");c&&!c.value&&(c.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let u=document.getElementById("manualReceiptInvoiceNo");u&&(u.value="");let f=document.getElementById("manualReceiptNotes");f&&(f.value="");let h=document.getElementById("manualItemSearchInput");h&&(h.value="");let g=document.getElementById("manualItemCategorySelect");g&&(g.value=""),window.gManualReceiptLines=[],we();let p=document.getElementById("modalManualReceipt");p&&p.classList.remove("hidden"),await $e(n,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function Pt(){let e=document.getElementById("modalManualReceipt");e&&e.classList.add("hidden")}async function Zn(e){let n=document.getElementById("manualReceiptSiteBadge");n&&(n.textContent=e),await $e(e,window.gManualShowAllCatalog)}async function eo(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let e=document.getElementById("txtToggleManualCatalog");e&&(e.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let n=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await $e(n,window.gManualShowAllCatalog)}async function $e(e,n){let a=document.getElementById("manualCatalogListContainer");a&&(a.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let t=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(e)}${n?"&include_all=1":""}`,s=await(await fetch(t)).json();s.success&&s.data?window.gManualSiteCatalog=s.data.items||[]:window.gManualSiteCatalog=[],fe()}catch(t){console.error("loadManualCatalogItems error:",t),a&&(a.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${b(t.message)}</div>`)}}function fe(){let e=document.getElementById("manualCatalogListContainer"),n=document.getElementById("manualCatalogCountText"),a=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),t=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),o=window.gManualSiteCatalog||[];if(a&&(o=o.filter(s=>{let r=(s.code||s.sku||"").toLowerCase(),i=(s.name||"").toLowerCase();return r.includes(a)||i.includes(a)})),t&&(o=o.filter(s=>(s.nhom_hang||s.item_group||s.nganh_hang||"").toLowerCase().includes(t))),n&&(n.textContent=String(o.length)),!!e){if(!o.length){e.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${a?`v\u1EDBi t\u1EEB kh\xF3a "${b(a)}"`:""}.
      </div>
    `;return}e.innerHTML=o.map(s=>{let r=s.code||s.sku,i=(window.gManualReceiptLines||[]).find(c=>c.item_code===r),l=parseFloat(s.book_qty||0),d=parseFloat(s.unit_price||0);return`
      <div onclick="addManualReceiptItem('${r}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${i?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${b(s.name||r)}">
              ${b(s.name||r)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${b(s.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${b(r)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${l>0?"text-emerald-600":"text-gray-500"} font-mono">${l.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${d>0?Math.round(d).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
          </div>
        </div>
        <div>
          ${i?`
            <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs font-mono">
              <i data-lucide="check" class="w-3 h-3"></i> x${i.qty}
            </span>
          `:`
            <button type="button" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors">
              <i data-lucide="plus" class="w-3 h-3"></i> Th\xEAm
            </button>
          `}
        </div>
      </div>
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function to(e){let n=(window.gManualSiteCatalog||[]).find(t=>(t.code||t.sku)===e);if(!n)return;let a=(window.gManualReceiptLines||[]).find(t=>t.item_code===e);if(a)a.qty=Math.round((a.qty+1)*100)/100;else{let o="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),s=new Date;s.setFullYear(s.getFullYear()+1);let r=s.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:n.code||n.sku,item_name:n.name||n.code,unit:n.unit||"Ph\u1EA7n",unit_price:parseFloat(n.unit_price||0),qty:1,batch_code:o,exp_date:r,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}we(),fe()}function we(){let e=document.getElementById("manualLinesEmptyState"),n=document.getElementById("manualLinesTableWrapper"),a=document.getElementById("manualLinesMobileCards"),t=document.getElementById("btnClearAllManualLines"),o=document.getElementById("manualLinesTableBody"),s=document.getElementById("manualSelectedCountText"),r=document.getElementById("manualSummaryTotalSkus"),i=document.getElementById("manualSummaryTotalQty"),l=document.getElementById("manualSummaryTotalAmount"),d=window.gManualReceiptLines||[];if(s&&(s.textContent=String(d.length)),r&&(r.textContent=d.length+" m\xE3"),!d.length){e&&e.classList.remove("hidden"),n&&(n.classList.add("hidden"),n.classList.remove("lg:block")),a&&(a.classList.add("hidden"),a.classList.remove("block")),t&&(t.classList.add("hidden"),t.classList.remove("flex")),i&&(i.textContent="0"),l&&(l.textContent="0 \u0111");return}e&&e.classList.add("hidden"),n&&(n.classList.remove("hidden"),n.classList.add("lg:block")),a&&(a.classList.remove("hidden"),a.classList.add("block")),t&&(t.classList.remove("hidden"),t.classList.add("flex"));let c=0,u=0;o&&(o.innerHTML=d.map((f,h)=>{let g=(f.qty||0)*(f.unit_price||0);return c+=f.qty||0,u+=g,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${h+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${b(f.item_name)}">
              ${b(f.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${b(f.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${b(f.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${f.qty}" 
                   oninput="onManualLineQtyChange(${h}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${f.unit_price}" 
                   oninput="onManualLinePriceChange(${h}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${h}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${g>0?Math.round(g).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${b(f.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${h}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${f.exp_date||""}" 
                   onchange="onManualLineExpChange(${h}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${b(f.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${h}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${h})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=d.map((f,h)=>{let g=(f.qty||0)*(f.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${h+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${b(f.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${b(f.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${h})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${b(f.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${f.qty}" 
                     oninput="onManualLineQtyChange(${h}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${f.unit_price}" 
                     oninput="onManualLinePriceChange(${h}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${g>0?Math.round(g).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${b(f.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${h}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${f.exp_date||""}" 
                   onchange="onManualLineExpChange(${h}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),i&&(i.textContent=c>0?Number.isInteger(c)?String(c):c.toFixed(1):"0"),l&&(l.textContent=u>0?Math.round(u).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function no(e,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let a=parseFloat(n);window.gManualReceiptLines[e].qty=isNaN(a)?0:a,nt()}function oo(e,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let a=parseFloat(n);window.gManualReceiptLines[e].unit_price=isNaN(a)?0:a,nt()}function nt(){let e=0,n=0;(window.gManualReceiptLines||[]).forEach((o,s)=>{let r=(o.qty||0)*(o.unit_price||0);e+=o.qty||0,n+=r;let i=document.getElementById(`manualLineTotal_${s}`);i&&(i.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let a=document.getElementById("manualSummaryTotalQty"),t=document.getElementById("manualSummaryTotalAmount");a&&(a.textContent=e.toFixed(1)),t&&(t.textContent=Math.round(n).toLocaleString("vi-VN")+" \u0111")}function ao(e,n){!window.gManualReceiptLines||!window.gManualReceiptLines[e]||(window.gManualReceiptLines[e].batch_code=n)}function ro(e,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;window.gManualReceiptLines[e].exp_date=n;let a=document.getElementById(`manualLineExpWarning_${e}`);a&&(a.innerHTML=O(n),window.lucide&&window.lucide.createIcons())}function so(e,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let a=new Date;a.setMonth(a.getMonth()+n);let t=a.toISOString().slice(0,10);window.gManualReceiptLines[e].exp_date=t;let o=document.getElementById(`manualLineExpInput_${e}`);o&&(o.value=t);let s=document.getElementById(`manualLineExpWarning_${e}`);s&&(s.innerHTML=O(t),window.lucide&&window.lucide.createIcons())}function io(e,n){!window.gManualReceiptLines||!window.gManualReceiptLines[e]||(window.gManualReceiptLines[e].storage_loc=n)}function Ot(e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let n=window.gManualReceiptLines[e];window.gManualReceiptLines.splice(e,1),we(),typeof fe=="function"&&fe(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(n.item_name||n.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function jt(){let e=window.gManualReceiptLines||[];if(!e.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let n=document.getElementById("confirmClearManualCountText");n&&(n.textContent=String(e.length));let a=document.getElementById("modalConfirmClearManualLines");a&&(a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function Vt(){let e=document.getElementById("modalConfirmClearManualLines");e&&e.classList.add("hidden")}function lo(){let e=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],Vt(),we(),fe(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${e} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function co(){let n=(window.gManualReceiptLines||[]).filter(g=>(g.qty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let a=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!a){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let t=new Date;t.setHours(0,0,0,0);let o=!1;for(let g of n)if(g.exp_date){let p=new Date(g.exp_date);if(p.setHours(0,0,0,0),p<=t){o=!0;break}}if(o&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let s=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",r=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),i=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",l=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",d=(document.getElementById("manualReceiptNotes")?.value||"").trim(),c=`[${i}] ${d}`.trim(),u=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",f={site_code:s,receipt_date:r,supplier:a,invoice_no:l,notes:c,created_by:u,lines:n.map(g=>({item_code:g.item_code,qty:g.qty,unit_price:g.unit_price,batch_code:(g.batch_code||"").trim(),exp_date:(g.exp_date||"").trim()||null,storage_loc:g.storage_loc||"K\u1EC7 B\u1EBFp",note:g.note||""}))},h=document.getElementById("btnSubmitManualReceipt");h&&(h.disabled=!0,h.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let p=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)})).json();if(!p.success)throw new Error(p.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${p.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${s} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Pt(),await ce(s),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(s),xe("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(g){console.error("submitManualReceipt error:",g),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+g.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),h&&(h.disabled=!1,h.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var k=window;k.gFnbReceiptCurrentView=k.gFnbReceiptCurrentView||"po";k.gFnbPoList=k.gFnbPoList||[];k.gReceiptLines=k.gReceiptLines||[];k.gManualReceiptLines=k.gManualReceiptLines||[];k.gManualSiteCatalog=k.gManualSiteCatalog||[];k.gManualShowAllCatalog=k.gManualShowAllCatalog||!1;k.getActiveFnbReceiptSite=W;k.formatReceiptDateYMD=le;k.getReceiptExpWarningHtml=O;k.switchFnbReceiptSubView=xe;k.loadFnbReceipts=jn;k.onFnbPoSearchInput=Vn;k.loadFnbPoList=ce;k.renderFnbPoTable=tt;k.openPoReceiptModal=At;k.renderReceiptLinesTable=Dt;k.onReceiptLineQtyChange=Un;k.onReceiptLineBatchChange=Wn;k.onReceiptLineExpChange=Kn;k.setReceiptLineQuickExp=Gn;k.onReceiptLineNoteChange=Xn;k.closeCreateReceiptModal=Rt;k.openCreateReceiptModal=qn;k.submitCreateReceipt=zn;k.loadFnbReceiptsHistory=Qn;k.viewReceiptDetail=Jn;k.openManualReceiptModal=Yn;k.closeManualReceiptModal=Pt;k.onManualReceiptSiteChange=Zn;k.toggleManualShowAllCatalog=eo;k.loadManualCatalogItems=$e;k.filterManualCatalogList=fe;k.addManualReceiptItem=to;k.renderManualReceiptLinesTable=we;k.onManualLineQtyChange=no;k.onManualLinePriceChange=oo;k.updateManualTotals=nt;k.onManualLineBatchChange=ao;k.onManualLineExpChange=ro;k.setManualLineQuickExp=so;k.onManualLineLocChange=io;k.removeManualReceiptLine=Ot;k.removeManualLine=Ot;k.confirmClearAllManualReceiptLines=jt;k.clearAllManualReceiptLines=jt;k.closeConfirmClearManualLinesModal=Vt;k.executeClearAllManualReceiptLines=lo;k.submitManualReceipt=co;function K(){let e=document.getElementById("globalBranchSelect")?.value,n=localStorage.getItem("orbit_user_site"),a=window,t=typeof a.App<"u"&&a.App.currentBranch?a.App.currentBranch.toUpperCase():null,o=document.getElementById("fnbWasteFilterSite")?.value,s=e||n||t||o||"K001";return(s==="ALL"||s==="all")&&(s="K001"),s.toUpperCase()}function Ut(){let e=document.getElementById("fnbWasteFilterSite");if(!e)return;let n=e.value||K(),a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(t=>t.code!=="ALL");if(a&&a.length){let t="";a.forEach(o=>{t+=`<option value="${o.code}" ${o.code.toUpperCase()===n.toUpperCase()?"selected":""}>${o.name}</option>`}),e.innerHTML=t,n&&Array.from(e.options).some(o=>o.value===n)&&(e.value=n)}}function ve(e){let n=document.getElementById("subtab-fnb-waste-stock"),a=document.getElementById("subtab-fnb-waste-history"),t=document.getElementById("fnbWasteSubViewStock"),o=document.getElementById("fnbWasteSubViewHistory");e==="history"?(n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),a&&(a.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),t&&t.classList.add("hidden"),o&&o.classList.remove("hidden")):(n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),a&&(a.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),t&&t.classList.remove("hidden"),o&&o.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function Wt(e){let n=e||K(),a=document.getElementById("fnbWasteTableBody"),t=document.getElementById("fnbWasteMobileCards"),o=document.getElementById("fnbWasteBadgeHistoryCount");try{let r=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(n)}&no-cache=1`)).json();if(r.success&&r.data){let i=r.data.wastes||[];o&&(o.textContent=String(i.length)),a&&(i.length?a.innerHTML=i.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${b(l.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${b(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${b(String(l.waste_date||"").slice(0,10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${b(l.reason||"H\xE0ng h\u1ECFng")}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${b(l.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u20AB</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${b(l.notes||"\u2014")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${l.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi ti\u1EBFt">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):a.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${b(n)}.</td></tr>`),t&&(i.length?t.innerHTML=i.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${b(l.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${b(l.reason||"H\xE0ng h\u1ECFng")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y: ${b(String(l.waste_date||"").slice(0,10))} \u2022 \u0110i\u1EC3m: ${b(l.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u20AB</span>
                  <span class="text-xs text-gray-400">${b(l.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</span>
                </div>
              </div>
            </div>
          `).join(""):t.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(s){console.error("loadFnbWasteHistory error:",s)}}async function uo(e){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let a=await(await fetch(`/api/fnb/wastes?id=${e}`)).json();if(!a.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let t=a.data.lines||[],o=document.getElementById("invDetailModal"),s=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");s&&(s.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${e}`),r&&(r.textContent=`${t.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let i=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-2 text-center">\u0110VT</th>
              <th class="py-2 px-3 text-right">SL H\u1EE7y</th>
              <th class="py-2 px-3 text-right">\u0110\u01A1n Gi\xE1</th>
              <th class="py-2 px-3 text-right">Th\xE0nh Ti\u1EC1n</th>
              <th class="py-2 px-3">L\xFD Do Chi Ti\u1EBFt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${t.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${b(d.item_name||d.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${b(d.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${b(d.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(d.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(d.unit_price).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(d.amount).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${b(d.reason_detail||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=i),o&&o.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Kt(){let e=document.getElementById("fnbWasteNganhHangFilter"),n=document.getElementById("fnbWasteNhomHangFilter");if(!e||!n)return;let a=new Map;(window.gFnbWasteStockItems||[]).forEach(o=>{let s=(o.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),r=(o.nhom_hang||o.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();a.has(s)||a.set(s,new Set),a.get(s).add(r)}),window.gFnbWasteNganhMap=a;let t='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(a.keys()).sort().forEach(o=>{t+=`<option value="${b(o)}">${b(o)}</option>`}),e.innerHTML=t,e.value="",ot("")}function ot(e){let n=document.getElementById("fnbWasteNhomHangFilter");if(!n)return;let a=new Set;window.gFnbWasteNganhMap&&(e&&window.gFnbWasteNganhMap.has(e)?window.gFnbWasteNganhMap.get(e).forEach(o=>a.add(o)):window.gFnbWasteNganhMap.forEach(o=>o.forEach(s=>a.add(s))));let t='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(a).sort().forEach(o=>{t+=`<option value="${b(o)}">${b(o)}</option>`}),n.innerHTML=t,n.value=""}function po(){let e=document.getElementById("fnbWasteNganhHangFilter")?.value||"";ot(e),ke()}function go(){ke()}function mo(e){ke()}function ho(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function ke(){let e=document.getElementById("fnbWasteStockTableBody"),n=document.getElementById("fnbWasteStockMobileCards"),a=document.getElementById("fnbWasteStockEmptyState"),t=document.getElementById("fnbWasteSummary"),o=document.getElementById("fnbWasteBadgeInStockCount"),s=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),r=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),i=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),l=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),d=window.gFnbWasteStockItems||[],c=document.getElementById("kpiWasteInStockCount"),u=document.getElementById("kpiWasteInStockVal");c&&(c.textContent=String(d.length));let f=0;if(d.forEach(p=>{f+=Number(p.total_value)||Number(p.book_qty)*Number(p.unit_price)||0}),u){let p=Ht(f);u.innerHTML=`${p.val}<span class="kpi-unit">${p.unit}</span>`}o&&(o.textContent=String(d.length));let h=d.filter(p=>{if(i==="EXP"&&(p.days_remaining!==void 0?Number(p.days_remaining):999)>15&&!p.is_expired||s&&(p.nganh_hang||"").trim().toLowerCase()!==s||r&&(p.nhom_hang||p.item_group||"").trim().toLowerCase()!==r)return!1;if(l){let m=(p.name||"").toLowerCase(),y=(p.code||"").toLowerCase();if(!m.includes(l)&&!y.includes(l))return!1}return!0});if(t&&(t.textContent=`Hi\u1EC3n th\u1ECB ${h.length} / ${d.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),at(),!h.length){e&&(e.innerHTML=""),n&&(n.innerHTML=""),a&&a.classList.remove("hidden");return}a&&a.classList.add("hidden");let g=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];e&&(e.innerHTML=h.map((p,m)=>{let y=Number(p.book_qty)||0,x=Number(p.unit_price)||0,w=Number(p.total_value)||y*x,v=p.wasteQty||0,L=v*x;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${m+1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${b(p.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${b(p.name||p.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${b(p.nganh_hang||p.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
              ${p.nhom_hang&&p.nhom_hang!==p.nganh_hang?`<span>\u2022</span><span>${b(p.nhom_hang)}</span>`:""}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${b(p.unit||"Ph\u1EA7n")}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(x).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${y.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(w).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${y}" value="${v>0?v:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${b(p.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${b(p.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${g.map(C=>`<option value="${b(C)}" ${p.wasteReason===C?"selected":""}>${b(C)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${b(p.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${L>0?Math.round(L).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${b(p.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${b(p.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=h.map(p=>{let m=Number(p.book_qty)||0,y=Number(p.unit_price)||0,x=p.wasteQty||0,w=x*y;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${b(p.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${b(p.name||p.code)}</h4>
              <div class="text-xs text-gray-400">${b(p.nganh_hang||p.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${m.toFixed(1)} ${b(p.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(y).toLocaleString("vi-VN")} \u20AB / ${b(p.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${m.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${m}" value="${x>0?x:""}" placeholder="0"
                     oninput="onWasteLineQtyChange('${b(p.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Th\xE0nh Ti\u1EC1n H\u1EE7y</label>
              <div id="mobWasteLineTotal_${b(p.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${w>0?Math.round(w).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">L\xFD Do H\u1EE7y</label>
            <select onchange="onWasteLineReasonChange('${b(p.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${g.map(v=>`<option value="${b(v)}" ${p.wasteReason===v?"selected":""}>${b(v)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function fo(e,n){let a=(window.gFnbWasteStockItems||[]).find(l=>l.code===e);if(!a)return;let t=parseFloat(n),o=Number(a.book_qty)||0;isNaN(t)||t<0?a.wasteQty=0:t>o?(a.wasteQty=o,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${o})`)):a.wasteQty=t;let s=a.wasteQty*(Number(a.unit_price)||0),r=document.getElementById(`wasteLineTotal_${e}`);r&&(r.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let i=document.getElementById(`mobWasteLineTotal_${e}`);i&&(i.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),at()}function yo(e,n){let a=(window.gFnbWasteStockItems||[]).find(t=>t.code===e);a&&(a.wasteReason=n)}function bo(e,n){let a=(window.gFnbWasteStockItems||[]).find(t=>t.code===e);a&&(a.wasteNote=n)}function at(){let e=window.gFnbWasteStockItems||[],n=0,a=0;e.forEach(i=>{i.wasteQty>0&&(n++,a+=i.wasteQty*(Number(i.unit_price)||0))});let t=document.getElementById("kpiWasteSelectedCount");t&&(t.textContent=String(n));let o=document.getElementById("kpiWasteTotalEstAmount");if(o)if(a>0){let i=Ht(a);o.innerHTML=`${i.val}<span class="kpi-unit">${i.unit}</span>`}else o.textContent="0 \u20AB";let s=document.getElementById("btnSubmitDirectWaste"),r=document.getElementById("btnSubmitDirectWasteText");s&&(s.disabled=n===0),r&&(r.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${n})`)}async function xo(){let n=(window.gFnbWasteStockItems||[]).filter(l=>(l.wasteQty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let a=K(),t=new Date().toISOString().slice(0,10),o=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",s=0;n.forEach(l=>{s+=l.wasteQty*(Number(l.unit_price)||0)});let r={site_code:a,waste_date:t,reason:n.length===1?n[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:o,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${n.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:o,lines:n.map(l=>({item_code:l.code,qty:l.wasteQty,unit_price:Number(l.unit_price)||0,reason_detail:l.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:l.wasteNote||""}))},i=document.getElementById("btnSubmitDirectWaste");i&&(i.disabled=!0,i.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let d=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(!d.success)throw new Error(d.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${d.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${a} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),ve("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(l){console.error("submitDirectWaste error:",l),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+l.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),i&&(i.disabled=!1,i.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function wo(){let e=document.getElementById("createWasteModal"),n=K(),a=document.getElementById("wasteModalSite"),t=document.getElementById("wasteModalDate");if(t&&!t.value&&(t.value=new Date().toISOString().slice(0,10)),a){let s="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(r=>{s+=`<option value="${r.code}" ${r.code===n?"selected":""}>${r.ten||r.name}</option>`}),a.innerHTML=s,a.value=n}await rt(n);let o=document.getElementById("wasteLinesContainer");o&&(o.innerHTML=""),st(),e&&e.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function Gt(){let e=document.getElementById("createWasteModal");e&&e.classList.add("hidden")}async function vo(){let e=document.getElementById("wasteModalSite")?.value||"K001";await rt(e);let n=document.getElementById("wasteLinesContainer");n&&(n.innerHTML=""),st()}async function rt(e){try{let a=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(e)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=a.success&&a.data?a.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function st(){let e=document.getElementById("wasteLinesContainer");if(!e)return;let n=window.gWasteModalInStockItems||[],a="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),t='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';n.forEach(s=>{t+=`<option value="${b(s.code)}" data-price="${s.unit_price}" data-unit="${b(s.unit||"")}" data-stock="${s.book_qty}">[${b(s.code)}] ${b(s.name)} (T\u1ED3n: ${Number(s.book_qty).toFixed(1)} ${b(s.unit||"")})</option>`});let o=`
    <div id="${a}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${a}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${t}
        </select>
        <button type="button" onclick="document.getElementById('${a}')?.remove(); recalculateWasteModalTotal();" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">SL H\u1EE7y</label>
          <input type="number" step="0.01" min="0" placeholder="0" oninput="onWasteModalLineQtyInput('${a}', this.value)" class="waste-modal-qty w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold tabular-nums text-center outline-none focus:border-rose-500 font-mono">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">\u0110\u01A1n Gi\xE1</label>
          <div class="waste-modal-price py-1 px-2 text-xs tabular-nums text-gray-600 dark:text-gray-300 font-mono">0 \u20AB</div>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">Th\xE0nh Ti\u1EC1n</label>
          <div class="waste-modal-amt py-1 px-2 text-xs font-bold tabular-nums text-rose-600 text-right font-mono">0 \u20AB</div>
        </div>
      </div>
    </div>
  `;e.insertAdjacentHTML("beforeend",o),window.lucide&&window.lucide.createIcons()}function ko(e,n){let a=document.getElementById(e);if(!a)return;let t=n.options[n.selectedIndex],o=Number(t?.getAttribute("data-price"))||0,s=Number(t?.getAttribute("data-stock"))||0,r=a.querySelector(".waste-modal-price");r&&(r.textContent=Math.round(o).toLocaleString("vi-VN")+" \u20AB");let i=a.querySelector(".waste-modal-qty");i&&(i.max=String(s),i.placeholder=`T\u1ED1i \u0111a ${s.toFixed(1)}`),Xt(e,i?i.value:"0")}function Xt(e,n){let a=document.getElementById(e);if(!a)return;let t=a.querySelector("select"),o=t?.options[t.selectedIndex],s=Number(o?.getAttribute("data-price"))||0,i=(parseFloat(n)||0)*s,l=a.querySelector(".waste-modal-amt");l&&(l.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),qt()}function qt(){let e=document.getElementById("wasteLinesContainer");if(!e)return;let n=0;e.querySelectorAll(".p-3").forEach(t=>{let o=t.querySelector("select"),s=o?.options[o.selectedIndex],r=Number(s?.getAttribute("data-price"))||0,i=t.querySelector(".waste-modal-qty"),l=parseFloat(i?.value||"0")||0;n+=l*r});let a=document.getElementById("wasteModalTotalAmount");a&&(a.textContent=n>0?Math.round(n).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function Lo(){let e=document.getElementById("wasteLinesContainer");if(!e)return;let n=[];if(e.querySelectorAll(".p-3").forEach(c=>{let u=c.querySelector("select"),f=u?.value,h=u?.options[u.selectedIndex],g=Number(h?.getAttribute("data-price"))||0,p=c.querySelector(".waste-modal-qty"),m=parseFloat(p?.value||"0")||0;f&&m>0&&n.push({item_code:f,qty:m,unit_price:g,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let a=document.getElementById("wasteModalSite")?.value||K(),t=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),o=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",s=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",r=document.getElementById("wasteModalNotes")?.value||"",i=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",l={site_code:a,waste_date:t,reason:o,confirmed_by:s,notes:r,created_by:i,lines:n},d=document.getElementById("btnSubmitWaste");d&&(d.disabled=!0,d.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let u=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)})).json();if(!u.success)throw new Error(u.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${u.data.waste_code}!`),Gt(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),ve("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(c){console.error("submitCreateWaste error:",c),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+c.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),d&&(d.disabled=!1,d.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function Sr(){Ut();let e=K(),n=document.getElementById("fnbWasteFilterSite");n&&n.value!==e&&(n.value=e);let a=document.getElementById("fnbWasteSummary");a&&(a.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+e+"...");try{let o=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(e)}&in_stock_only=1&no-cache=1`)).json();o.success&&o.data?window.gFnbWasteStockItems=(o.data.items||[]).map(s=>({...s,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],Kt(),ke(),Wt(e)}catch(t){console.error("loadFnbWaste error:",t),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+t.message)}}var S=window;S.gFnbWasteStockItems=S.gFnbWasteStockItems||[];S.gFnbWasteNganhMap=S.gFnbWasteNganhMap||null;S.gWasteModalInStockItems=S.gWasteModalInStockItems||[];S.getActiveFnbWasteSite=K;S.populateFnbWasteSiteDropdown=Ut;S.loadFnbWaste=Sr;S.switchFnbWasteSubView=ve;S.populateFnbWasteFilters=Kt;S.populateFnbWasteNhomHangDropdown=ot;S.onFnbWasteNganhHangChange=po;S.onFnbWasteFilterChange=go;S.onFnbWasteSearch=mo;S.onFnbWasteSiteChange=ho;S.renderFnbWasteStockTable=ke;S.onWasteLineQtyChange=fo;S.onWasteLineReasonChange=yo;S.onWasteLineNoteChange=bo;S.updateWasteKPIs=at;S.submitDirectWaste=xo;S.loadFnbWasteHistory=Wt;S.viewWasteDetail=uo;S.openCreateWasteModal=wo;S.closeCreateWasteModal=Gt;S.onWasteModalSiteChange=vo;S.loadWasteModalItems=rt;S.addWasteLineRow=st;S.onWasteModalItemSelect=ko;S.onWasteModalLineQtyInput=Xt;S.recalculateWasteModalTotal=qt;S.submitCreateWaste=Lo;function Z(){let e=localStorage.getItem("orbit_user_site"),n=document.getElementById("globalBranchSelect")?.value,a=window,t=typeof a.App<"u"&&a.App.currentBranch?a.App.currentBranch.toUpperCase():null,o=document.getElementById("fnbCountSiteSelect")?.value,s=e||n||t||o||"K001";return(s==="ALL"||s==="all")&&(s="K001"),s.toUpperCase()}function it(){let e=document.getElementById("fnbCountNganhHangFilter"),n=document.getElementById("fnbCountNhomHangFilter");if(!e||!n)return;let a=new Map;(window.gFnbAllItems||[]).forEach(s=>{let r=(s.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),i=(s.nhom_hang||s.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();a.has(r)||a.set(r,new Set),a.get(r).add(i)}),window.gFnbNganhMap=a;let o='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(a.keys()).sort().forEach(s=>{o+=`<option value="${b(s)}">${b(s)}</option>`}),e.innerHTML=o,e.value="",dt("")}function dt(e){let n=document.getElementById("fnbCountNhomHangFilter");if(!n)return;let a=new Set;window.gFnbNganhMap&&(e&&window.gFnbNganhMap.has(e)?window.gFnbNganhMap.get(e).forEach(o=>a.add(o)):window.gFnbNganhMap.forEach(o=>o.forEach(s=>a.add(s))));let t='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(a).sort().forEach(o=>{t+=`<option value="${b(o)}">${b(o)}</option>`}),n.innerHTML=t,n.value=""}function To(){let e=document.getElementById("fnbCountNganhHangFilter")?.value||"";dt(e),q()}function Eo(){q()}function Co(e){q()}function So(){q()}function Io(){let e=document.getElementById("fnbCountSiteSelect");if(e&&e.value&&e.value!=="all"){try{localStorage.setItem("orbit_user_site",e.value)}catch{}let n=document.getElementById("globalBranchSelect");n&&(n.value=e.value)}typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}function Mo(e){window.gFnbBlindCount=e,q()}function _o(e,n){let a=(window.gCurrentCountItems||[]).find(t=>t.code===e);a&&(a.userCount=n===""?0:Number(n),q())}function $o(e,n){let a=(window.gCurrentCountItems||[]).find(t=>t.code===e);a&&(a.userNote=n)}function q(){let e=document.getElementById("fnbCountsTableBody"),n=document.getElementById("fnbCountsMobileCards"),a=(document.getElementById("fnbCountNganhHangFilter")?.value||"").trim().toLowerCase(),t=(document.getElementById("fnbCountNhomHangFilter")?.value||"").trim().toLowerCase(),o=document.getElementById("fnbCountStatusFilter")?.value||"all",s=(document.getElementById("fnbCountSearchInput")?.value||"").trim().toLowerCase(),r=window.gFnbAllItems||[],i=r.filter(p=>{if(a&&(p.nganh_hang||"").trim().toLowerCase()!==a||t&&(p.nhom_hang||p.item_group||"").trim().toLowerCase()!==t)return!1;if(o!=="all"){let m=Number(p.book_qty)||0,x=(p.userCount!==void 0?Number(p.userCount):p.last_count_qty!==null&&p.last_count_qty!==void 0?Number(p.last_count_qty):m)-m,w=p.userCount!==void 0||p.last_count_qty!==null;if(o==="diff"&&Math.abs(x)<.001||o==="matched"&&Math.abs(x)>=.001||o==="counted"&&!w||o==="uncounted"&&w)return!1}if(s){let m=(p.name||"").toLowerCase(),y=(p.code||"").toLowerCase(),x=(p.nganh_hang||"").toLowerCase(),w=(p.nhom_hang||"").toLowerCase();if(!m.includes(s)&&!y.includes(s)&&!x.includes(s)&&!w.includes(s))return!1}return!0});window.gCurrentCountItems=i;let l=0,d=0,c=0;i.forEach(p=>{let m=Number(p.book_qty)||0,y=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:m,w=(Number(y)||0)-m,v=w*(Number(p.unit_price)||0);Math.abs(w)<.001?l++:d++,c+=v});let u=document.getElementById("fnbCountMetricTotal");u&&(u.textContent=String(i.length));let f=document.getElementById("fnbCountMetricMatched");f&&(f.textContent=String(l));let h=document.getElementById("fnbCountMetricDiff");h&&(h.textContent=String(d));let g=document.getElementById("fnbCountMetricDiffVal");g&&(g.textContent=(c>0?"+":"")+Math.round(c).toLocaleString("vi-VN")+" \u0111"),e&&(i.length===0?!r||r.length===0?e.innerHTML=`<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
            <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nh\u1EADp H\xE0ng \u0110i\u1EC3m B\xE1n</a> tr\u01B0\u1EDBc khi th\u1EF1c hi\u1EC7n ki\u1EC3m k\xEA.</p>
          </div>
        </td></tr>`:e.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>':e.innerHTML=i.map((p,m)=>{let y=Number(p.book_qty)||0,x=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:y,w=Number(x)||0,v=w-y,L=v*(Number(p.unit_price)||0),C='<span class="text-gray-400 tabular-nums">0</span>';v>0?C=`<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${v.toFixed(1)}</span>`:v<0&&(C=`<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${v.toFixed(1)}</span>`);let M='<span class="text-gray-400 tabular-nums font-mono">0 \u0111</span>';L>0?M=`<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(L).toLocaleString("vi-VN")} \u0111</span>`:L<0&&(M=`<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(L).toLocaleString("vi-VN")} \u0111</span>`);let F=window.gFnbBlindCount?'<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">\u2022\u2022\u2022\u2022</span>':`<span class="font-bold tabular-nums font-mono ${y<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${y.toFixed(1)}</span>`,B=p.nhom_hang||p.item_group||"";return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${m+1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${b(p.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${b(p.code)}</span>
                ${B?`<span>\u2022</span><span class="text-gray-500 dark:text-gray-400">${b(B)}</span>`:""}
                <span>\u2022</span>
                <span class="font-mono">Gi\xE1: ${Number(p.unit_price).toLocaleString("vi-VN")} \u0111</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${b(p.unit||"")}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${F}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${w}" oninput="onCountInputChange('${b(p.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${C}</td>
            <td class="py-3 px-3 text-right select-all">${M}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="L\xFD do ch\xEAnh l\u1EC7ch (n\u1EBFu c\xF3)..." value="${b(p.userNote||"")}" oninput="onCountNoteChange('${b(p.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `}).join("")),n&&(i.length===0?!r||r.length===0?n.innerHTML=`<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
          <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nh\u1EADp H\xE0ng</a> tr\u01B0\u1EDBc khi ki\u1EC3m k\xEA.</p>
        </div>`:n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':n.innerHTML=i.map(p=>{let m=Number(p.book_qty)||0,y=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:m,x=Number(y)||0,w=x-m,v=w*(Number(p.unit_price)||0);return`
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${b(p.nhom_hang||p.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${b(p.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${b(p.code)}</span> \u2022 ${Number(p.unit_price).toLocaleString("vi-VN")} \u0111/${b(p.unit||"")}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">T\u1ED3n s\xE1ch:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${m<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${window.gFnbBlindCount?"\u2022\u2022\u2022\u2022":m.toFixed(1)} ${b(p.unit||"")}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">SL Th\u1EF1c t\u1EBF:</span>
                <input type="number" step="0.1" value="${x}" oninput="onCountInputChange('${b(p.code)}', this.value)"
                       class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 font-bold tabular-nums text-gray-900 dark:text-white outline-none font-mono">
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-0.5">Ch\xEAnh l\u1EC7ch:</span>
                <div class="font-bold text-xs pt-1.5 tabular-nums font-mono ${w>0?"text-emerald-600":w<0?"text-rose-600":"text-gray-400"}">
                  ${w>0?"+":""}${w.toFixed(1)} (${(v>0?"+":"")+Math.round(v).toLocaleString("vi-VN")} \u0111)
                </div>
              </div>
            </div>

            <input type="text" placeholder="Ghi ch\xFA l\xFD do..." value="${b(p.userNote||"")}" oninput="onCountNoteChange('${b(p.code)}', this.value)"
                   class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none">
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function Bo(){let e=Z(),n=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),a="DAILY",t=window.gCurrentCountItems||[];if(!t||!t.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 l\u01B0u ki\u1EC3m k\xEA!");return}let o=t.map(r=>{let i=Number(r.book_qty)||0,l=r.userCount!==void 0?Number(r.userCount):r.last_count_qty!==null&&r.last_count_qty!==void 0?Number(r.last_count_qty):i,d=l-i,c=d*(Number(r.unit_price)||0);return{item_code:r.code,item_name:r.name,item_group:r.item_group||r.nhom_hang||"NVL",unit:r.unit,unit_price:Number(r.unit_price)||0,book_qty:i,actual_qty:l,count_qty:l,diff_qty:d,diff_value:c,diff_val:c,note:r.userNote||""}}),s={site_code:e,count_date:n,count_type:a,notes:`Ki\u1EC3m k\xEA h\u1EB1ng ng\xE0y \u0111i\u1EC3m ${e}`,lines:o};try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA...");let i=await(await fetch("/api/fnb/counts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();if(!i.success)throw new Error(i.error||"L\u1ED7i khi l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA");typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA ${i.data.count_code} th\xE0nh c\xF4ng!`),typeof window.loadFnbCounts=="function"&&await window.loadFnbCounts()}catch(r){console.error("saveFnbCountAudit error:",r),typeof window.showToast=="function"&&window.showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+r.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function zt(e){let n=e||Z();try{let t=await(await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(n)}`)).json(),o=document.getElementById("fnbCountsHistoryBody"),s=document.getElementById("fnbCountsHistoryMobileCards");if((o||s)&&t.success){let r=t.data.counts||[];r.length?(o&&(o.innerHTML=r.map(i=>`
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${i.id})">${b(i.count_code)}</td>
              <td class="py-2.5 px-3 font-semibold">${b(i.site_code)}</td>
              <td class="py-2.5 px-3 tabular-nums">${b(i.count_date)}</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${i.count_type==="DAILY"?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"}">${i.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span></td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono">${i.total_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono ${i.diff_items>0?"text-rose-600 font-bold":"text-emerald-600"}">${i.diff_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${i.diff_value>0||i.diff_value<0?"text-rose-600":"text-emerald-600"}">${Math.round(i.diff_value).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-2.5 px-3 text-gray-400">${b(i.notes||"\u2014")}</td>
            </tr>
          `).join("")),s&&(s.innerHTML=r.map(i=>`
            <div class="data-card cursor-pointer p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2" onclick="viewCountDetail(${i.id})">
              <div class="data-card-header flex items-center justify-between">
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">${b(i.count_code)}</span>
                <span class="badge ${i.count_type==="DAILY"?"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300":"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"} text-xs px-2 py-0.5 rounded-full font-bold">${i.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span>
              </div>
              <div class="data-card-body space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">\u0110i\u1EC3m b\xE1n: <b class="text-gray-700 dark:text-gray-200">${b(i.site_code)}</b></span>
                  <span class="num text-gray-500">${i.count_date}</span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div>
                    <span class="text-gray-400 block text-[11px]">T\u1ED5ng m\xF3n</span>
                    <span class="num font-semibold text-gray-900 dark:text-white font-mono">${i.total_items||0}</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-[11px]">S\u1ED1 l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(i.diff_items)>0?"text-rose-600 dark:text-rose-400":"text-emerald-600"}">${i.diff_items||0}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-gray-400 block text-[11px]">Gi\xE1 tr\u1ECB l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(i.diff_value)!==0?"text-rose-600 dark:text-rose-400":"text-gray-900 dark:text-white"}">${Math.round(Number(i.diff_value)||0).toLocaleString("vi-VN")} \u20AB</span>
                  </div>
                </div>
              </div>
            </div>
          `).join(""))):(o&&(o.innerHTML=`<tr><td colspan="8" class="text-center py-6 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${b(n)}.</td></tr>`),s&&(s.innerHTML=`<div class="card p-6 text-center text-gray-400 text-sm">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${b(n)}.</div>`))}}catch(a){console.error("loadFnbCountsHistory error:",a)}}async function Ho(e){try{typeof window.showLoading=="function"&&window.showLoading();let a=await(await fetch(`/api/fnb/counts?id=${e}`)).json();if(!a.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu");let t=a.data.lines||[],o=document.getElementById("invDetailModal"),s=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");s&&(s.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Ki\u1EC3m K\xEA #${e}`),r&&(r.textContent=`${t.length} m\u1EB7t h\xE0ng ki\u1EC3m k\xEA`);let i=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-3 text-right">T\u1ED3n S\xE1ch</th>
              <th class="py-2 px-3 text-right">SL \u0110\u1EBFm</th>
              <th class="py-2 px-3 text-right">L\u1EC7ch</th>
              <th class="py-2 px-3 text-right">Ti\u1EC1n L\u1EC7ch</th>
              <th class="py-2 px-3">Ghi Ch\xFA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${t.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${b(d.item_name||d.item_code)}</td>
                <td class="py-2 px-3 text-right font-mono">${d.book_qty}</td>
                <td class="py-2 px-3 text-right font-bold text-blue-600 font-mono">${d.count_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${d.diff_qty<0?"text-rose-600":d.diff_qty>0?"text-emerald-600":"text-gray-400"}">${d.diff_qty>0?"+":""}${d.diff_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${d.diff_val<0?"text-rose-600":d.diff_val>0?"text-emerald-600":"text-gray-400"}">${d.diff_val>0?"+":""}${Math.round(d.diff_val).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${b(d.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=i),o&&o.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function No(){document.getElementById("invDetailModal")?.classList.add("hidden")}function Fo(){let e=window.gCurrentCountItems||[];if(!e||!e.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t phi\u1EBFu ki\u1EC3m!");return}let n=Z(),a=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),o=[["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)","T\u1ED3n S\u1ED5 S\xE1ch","S\u1ED1 \u0110\u1EBFm Th\u1EF1c T\u1EBF","Ch\xEAnh L\u1EC7ch","Ghi Ch\xFA"]];if(e.forEach((l,d)=>{let c=Number(l.book_qty)||0,u=l.userCount!==void 0?Number(l.userCount):l.last_count_qty!==null&&l.last_count_qty!==void 0?Number(l.last_count_qty):c,f=u-c;o.push([d+1,l.code,l.name,l.nganh_hang||"",l.nhom_hang||l.item_group||"",l.unit,Number(l.unit_price)||0,c,u,f,l.userNote||""])}),typeof XLSX>"u"){typeof window.showToast=="function"&&window.showToast("Th\u01B0 vi\u1EC7n XLSX ch\u01B0a s\u1EB5n s\xE0ng!");return}let s=XLSX.utils.aoa_to_sheet(o);s["!cols"]=[{wch:6},{wch:15},{wch:32},{wch:20},{wch:22},{wch:8},{wch:14},{wch:14},{wch:16},{wch:14},{wch:25}],s["!autofilter"]={ref:`A1:K${o.length}`},s["!views"]=[{state:"frozen",ySplit:1,xSplit:0}];let r=XLSX.utils.decode_range(s["!ref"]||"A1:K1");for(let l=r.s.r;l<=r.e.r;++l)for(let d=r.s.c;d<=r.e.c;++d){let c=XLSX.utils.encode_cell({r:l,c:d});if(s[c])if(l===0)s[c].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:d===0||d===1?"center":d>=6&&d<=9?"right":"left",wrapText:!1}};else{let u=d===0||d>=6&&d<=9,f=d===1||d===5;s[c].s={font:{name:"Aptos",sz:11,regular:!0,color:{rgb:"000000"}},alignment:{vertical:"center",horizontal:u?"right":f?"center":"left"}}}}let i=XLSX.utils.book_new();XLSX.utils.book_append_sheet(i,s,"PhieuKiemKe"),XLSX.writeFile(i,`Phieu_Kiem_Ke_${n}_${a}.xlsx`),typeof window.showToast=="function"&&window.showToast("\u0110\xE3 xu\u1EA5t phi\u1EBFu ki\u1EC3m k\xEA Excel theo quy chu\u1EA9n Aptos!")}async function Ir(){let e=Z(),n=document.getElementById("fnbCountSiteSelect");n&&n.value!==e&&(n.value=e);let t=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(i=>i.code.toUpperCase()===e.toUpperCase()),o=t?t.ten||t.name:e,s=document.getElementById("fnbCountCurrentSiteBadge");s&&(s.textContent=o);let r=document.getElementById("fnbCountDatePicker");r&&!r.value&&(r.value=new Date().toISOString().slice(0,10));try{typeof window.showLoading=="function"&&window.showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA c\u1EE7a "+e+"...");let l=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(e)}&no-cache=1`)).json();l.success&&l.data?(window.gFnbAllItems=l.data.items||[],it(),q()):(window.gFnbAllItems=[],it(),q()),zt(e)}catch(i){console.error("loadFnbCounts error:",i),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u ki\u1EC3m k\xEA: "+i.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}var _=window;_.gFnbAllItems=_.gFnbAllItems||[];_.gCurrentCountItems=_.gCurrentCountItems||[];_.gFnbBlindCount=_.gFnbBlindCount||!1;_.gFnbNganhMap=_.gFnbNganhMap||null;_.getActiveFnbCountSite=Z;_.loadFnbCounts=Ir;_.populateFnbCountFilters=it;_.populateFnbCountNhomHangDropdown=dt;_.onFnbCountNganhHangChange=To;_.onFnbCountFilterChange=Eo;_.onFnbCountSearch=Co;_.onFnbCountDateChange=So;_.onFnbCountSiteChange=Io;_.toggleBlindCount=Mo;_.onCountInputChange=_o;_.onCountNoteChange=$o;_.renderFnbCountsTable=q;_.saveFnbCountAudit=Bo;_.loadFnbCountsHistory=zt;_.viewCountDetail=Ho;_.closeInvDetailModal=No;_.exportCountSheetExcel=Fo;function lt(e){if(!e||!e.rows||e.rows.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}try{let n=e.sites||[],a=e.rows||[],t=e.groups||{},o=["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)"];n.forEach(u=>{o.push(u.ten||u.name||u.code)});let s=[o];a.forEach((u,f)=>{let h=t[u.group]||u.group,g=[f+1,u.code,u.name,h,u.unit,u.price||0];n.forEach(p=>{let m=u.cells?u.cells[p.id]:void 0;g.push(m&&m.book||0)}),s.push(g)});let r=XLSX.utils.aoa_to_sheet(s),i=XLSX.utils.decode_range(r["!ref"]),l=[{wch:6},{wch:14},{wch:32},{wch:18},{wch:8},{wch:14}];n.forEach(()=>l.push({wch:16})),r["!cols"]=l;for(let u=i.s.r;u<=i.e.r;++u)for(let f=i.s.c;f<=i.e.c;++f){let h=XLSX.utils.encode_cell({r:u,c:f});if(!r[h])continue;if(u===0)r[h].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"CCCCCC"}},bottom:{style:"medium",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"CCCCCC"}},right:{style:"thin",color:{rgb:"CCCCCC"}}}};else{let p="left",m;f===0||f===1||f===4?p="center":(f===5||f>=6)&&(p="right",m="#,##0.00");let y=f>=6&&typeof r[h].v=="number"&&r[h].v<0;r[h].s={font:{name:"Aptos",sz:11,bold:y,color:{rgb:y?"C00000":"000000"}},alignment:{horizontal:p,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E5E5E5"}},bottom:{style:"thin",color:{rgb:"E5E5E5"}},left:{style:"thin",color:{rgb:"E5E5E5"}},right:{style:"thin",color:{rgb:"E5E5E5"}}}},m&&typeof r[h].v=="number"&&(r[h].z=m)}}r["!autofilter"]={ref:r["!ref"]},r["!freeze"]={xSplit:3,ySplit:1,topLeftCell:"D2",activePane:"bottomRight",state:"frozen"};let d=XLSX.utils.book_new();XLSX.utils.book_append_sheet(d,r,"T\u1ED3n Kho Chu\u1ED7i F&B");let c=new Date().toISOString().slice(0,10).replace(/-/g,"");XLSX.writeFile(d,`Ton_Kho_F&B_Chuoi_${c}.xlsx`),typeof showToast=="function"&&showToast("Xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho F&B th\xE0nh c\xF4ng (Font Aptos)!")}catch(n){console.error("Export Excel error:",n),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+(n?.message||n))}}var z=null,N={site:"ALL",group:"ALL",search:"",showValue:!1},ct="";async function Qt(){try{typeof showLoading=="function"&&showLoading();let e=new URL("/api/fnb/stock",window.location.origin);N.site&&N.site!=="ALL"&&N.site!=="all"&&e.searchParams.set("site_code",N.site),N.region&&N.region!=="ALL"&&e.searchParams.set("regionId",N.region),N.group&&N.group!=="ALL"&&e.searchParams.set("group",N.group),e.searchParams.set("refresh","true");let a=await(await fetch(e.toString())).json();if(!a.success||!a.data)throw new Error(a.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c d\u1EEF li\u1EC7u t\u1ED3n kho F&B");z=a.data,window.gFnbStockData=z,Be()}catch(e){console.error("Error loadFnbStock:",e),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i t\u1ED3n kho F&B: "+(e?.message||e))}finally{typeof hideLoading=="function"&&hideLoading()}}function Be(){if(!z)return;let e=z.sites||[],n=z.rows||[],a=z.groups||{},t=(ct||"").trim().toLowerCase(),o=n.filter(y=>{if(!t)return!0;let x=(y.name||"").toLowerCase().includes(t),w=(y.code||"").toLowerCase().includes(t);return x||w}),s=N.site,r=o;s&&s!=="ALL"&&s!=="all"&&(r=o.filter(y=>{let x=y.cells&&y.cells[s];return x&&(x.hasSiteRecord||x.book!==void 0&&Number(x.book)!==0||x.lastCount!==null&&x.lastCount!==void 0)}));let i=0,l=0,d=0;o.forEach(y=>{e.forEach(x=>{let w=y.cells&&y.cells[x.id];if(w){let v=Number(w.value)||0,L=Number(w.book)||0;i+=v,L<0&&l++,w.noOpening&&d++}})});let c=document.getElementById("fnbStockKpiTotalItems"),u=document.getElementById("fnbStockKpiTotalValue"),f=document.getElementById("fnbStockKpiNegative"),h=document.getElementById("fnbStockKpiNoOpening");c&&(c.textContent=r.length.toLocaleString("vi-VN")),u&&(u.textContent=Math.round(i).toLocaleString("vi-VN")+" \u0111"),f&&(f.textContent=l.toLocaleString("vi-VN")),h&&(h.textContent=d.toLocaleString("vi-VN"));let g=document.getElementById("fnbStockTableHead");if(g){let y=`
      <tr>
        <th class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">STT</th>
        <th class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-white/3 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">M\u1EB7t H\xE0ng F&amp;B</th>
        <th class="py-3 px-3 text-center w-16 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">\u0110VT</th>
    `;e.forEach(x=>{let w=x.region==="Mi\u1EC1n Nam";y+=`
        <th class="py-3 px-3 text-right font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 min-w-[125px]">
          <div class="flex items-center justify-end gap-1.5">
            <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${w?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${w?"MN":"MB"}</span>
            <span title="${x.name}" class="text-gray-800 dark:text-gray-200">${x.code}</span>
          </div>
          <div class="text-xs font-normal text-gray-400 truncate max-w-[115px]" title="${x.name}">${x.name}</div>
        </th>
      `}),y+="</tr>",g.innerHTML=y}let p=document.getElementById("fnbStockTableBody");p&&(r.length===0?p.innerHTML=`<tr><td colspan="${e.length+3}" class="text-center py-12 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>`:p.innerHTML=r.map((y,x)=>{let w=a[y.group]||y.group,v=`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${x+1}</td>
            <td class="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-white/3 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${w}</span>
                <span class="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">${y.name}</span>
              </div>
              <div class="text-xs tabular-nums text-gray-400 mt-0.5 flex items-center gap-2">
                <span>${y.code}</span>
                <span>\u2022</span>
                <span>Gi\xE1: ${y.price?Number(y.price).toLocaleString("vi-VN")+" \u0111":"--"}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-medium text-gray-600 dark:text-gray-300 text-xs">${y.unit}</td>
        `;return e.forEach(L=>{let C=y.cells&&y.cells[L.id]||{book:0,lastCount:null,noOpening:!0,value:0},M=Number(C.book)||0,B=M<0?"text-rose-600 dark:text-rose-400 font-semibold":M>0?"text-gray-900 dark:text-white font-bold":"text-gray-400 dark:text-gray-600 font-medium",_e="";if(C.lastCount!==null&&C.lastCount!==void 0&&C.lastCount!==""){let et=Number(C.lastCount);if(!isNaN(et)){let On=Number.isInteger(et)?et.toLocaleString("vi-VN"):et.toFixed(1);_e=` <span class="text-gray-400 dark:text-gray-500 font-normal text-xs" title="\u0110\u1EBFm g\u1EA7n nh\u1EA5t (${C.lastDate||"N/A"}): ${On}">(${On})</span>`}}let he="";C.noOpening&&(he='<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" title="Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u"></span>');let Bt="",Pn=Number(C.value)||0;N.showValue&&Pn&&(Bt=`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums mt-0.5">${Math.round(Pn).toLocaleString("vi-VN")} \u0111</div>`);let Cr=Number.isInteger(M)?M.toLocaleString("vi-VN"):M.toFixed(1);v+=`
            <td class="py-3 px-3 text-right tabular-nums text-xs select-all">
              <div class="flex items-center justify-end">
                ${he}
                <span class="${B}">${Cr}</span>${_e}
              </div>
              ${Bt}
            </td>
          `}),v+="</tr>",v}).join(""));let m=document.getElementById("fnbStockMobileCards");m&&(r.length===0?m.innerHTML='<div class="text-center py-10 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':m.innerHTML=o.map(y=>{let x=a[y.group]||y.group,w=e.map(v=>{let L=y.cells&&y.cells[v.id]||{book:0,lastCount:null,noOpening:!0,value:0},C=Number(L.book)||0,M=C<0,F=C===0,B=Number.isInteger(C)?C.toLocaleString("vi-VN"):C.toFixed(1),_e="";if(L.lastCount!==null&&L.lastCount!==void 0&&L.lastCount!==""){let he=Number(L.lastCount);isNaN(he)||(_e=`(${Number.isInteger(he)?he.toLocaleString("vi-VN"):he.toFixed(1)})`)}return{site:v,cell:L,isNeg:M,isZero:F,bookFormatted:B,countText:_e}});return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${x}</span>
                  <span class="text-xs tabular-nums text-gray-400 font-bold">${y.code}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">${y.name}</h4>
              </div>
              <div class="text-right shrink-0">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold tabular-nums">${y.unit}</span>
                <div class="text-xs text-gray-400 tabular-nums mt-1">${y.price?Number(y.price).toLocaleString("vi-VN")+" \u0111":""}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              ${w.map(v=>{let L=v.site.region==="Mi\u1EC1n Nam";return`
                  <div class="p-2.5 rounded-xl ${v.isNeg?"bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40":v.isZero?"bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/60":"bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60"}">
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${v.site.code}</span>
                      <span class="text-[8.5px] px-1 rounded font-semibold ${L?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${L?"MN":"MB"}</span>
                    </div>
                    <div class="flex items-baseline justify-between tabular-nums">
                      <span class="text-xs text-gray-400">T\u1ED3n:</span>
                      <span class="${v.isNeg?"text-rose-600 dark:text-rose-400 font-semibold text-sm":v.isZero?"text-gray-400 font-medium":"text-gray-900 dark:text-white font-bold text-sm"}">${v.bookFormatted} <span class="text-xs text-gray-400 font-normal">${v.countText}</span></span>
                    </div>
                    ${v.cell.noOpening?'<div class="text-xs text-amber-500 font-semibold mt-0.5">\u26A0\uFE0F Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u</div>':""}
                    ${N.showValue&&v.cell.value?`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums text-right mt-0.5">${Math.round(v.cell.value).toLocaleString("vi-VN")} \u0111</div>`:""}
                  </div>
                `}).join("")}
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Ao(){let e=document.getElementById("fnbStockFilterRegion"),n=document.getElementById("fnbStockFilterGroup"),a=document.getElementById("fnbStockFilterSite");a&&(N.site=a.value),e&&(N.region=e.value),n&&(N.group=n.value),Qt()}function Do(e){ct=e,Be()}function Ro(e){N.showValue=e,Be()}function ni(){lt(z)}var Q=window;Q.gFnbStockData=z;Q.gFnbStockFilter=N;Q.gFnbStockSearchTerm=ct;Q.loadFnbStock=Qt;Q.renderFnbStock=Be;Q.onFnbStockFilterChange=Ao;Q.onFnbStockSearch=Do;Q.onFnbStockToggleValue=Ro;Q.exportFnbStockExcel=()=>lt(Q.gFnbStockData||z);function Jt(e){return typeof window.cellCode=="function"?window.cellCode(e):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${e}</span>`}function Yt(e,n){return typeof window.cellBadge=="function"?window.cellBadge(e,n):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${n}</span>`}function Zt(e){if(typeof window.escapeHtml=="function")return window.escapeHtml(e);let n=document.createElement("div");return n.textContent=e||"",n.innerHTML}function H(e){return typeof window.fmtVND=="function"?window.fmtVND(e):E(Number(e)||0)}function en(e){return typeof window.fmtNum=="function"?window.fmtNum(e):T(Number(e)||0)}function ee(){let e=window;return e.App||(e.App={}),e.App.items||(e.App.items=[]),e.App.items}function ut(e){let n=window;n.App||(n.App={}),n.App.items=e}function He(){let e=document.getElementById("dinhMucBody"),n=document.getElementById("orderMobileCards"),a=(document.getElementById("orderSearch")?.value||"").toLowerCase(),t=document.getElementById("fLoai")?.value||"",o=document.getElementById("fChiNhap")?.checked,s=document.getElementById("orderSupplyChannel")?.value||"ALL",i=ee().filter(d=>{if(a&&!d.maHang.toLowerCase().includes(a)&&!d.tenSP.toLowerCase().includes(a)||t&&d.tenLoai!==t||o&&(!d.soLuongDat||d.soLuongDat<=0))return!1;if(s==="BTT"){let c=((d.nguonCung||"")+" "+(d.tenLoai||"")+" "+(d.tenSP||"")).toLowerCase();if(!c.includes("btt")&&!c.includes("trung t\xE2m")&&!c.includes("ch\u1EBF bi\u1EBFn"))return!1}else if(s==="NCC"){let c=((d.nguonCung||"")+" "+(d.tenLoai||"")).toLowerCase();if(c.includes("btt")||c.includes("trung t\xE2m"))return!1}else if(s==="URGENT"){let c=((d.nganh_hang||"")+" "+(d.tenLoai||"")+" "+(d.tenSP||"")).toLowerCase();if(!c.includes("t\u01B0\u01A1i")&&!c.includes("th\u1ECBt")&&!c.includes("rau")&&!c.includes("kh\u1EA9n"))return!1}return!0});if(!i.length){e&&(e.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</td></tr>'),n&&(n.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</div>');return}let l=window.innerWidth>=1024;e&&(l?e.innerHTML=i.map(d=>{let c=d.soLuongDat||"",u=(d.soLuongDat||0)*(d.donGia||0);return`
          <tr>
            <td class="col-code">${Jt(d.maHang)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white">${d.tenSP}</span></td>
            <td>${Yt("neutral",d.tenLoai||"CCDC")}</td>
            <td>${d.dvt||"C\xE1i"}</td>
            <td class="col-num"><span class="num">${H(d.donGia)}</span></td>
            <td class="col-num"><span class="num">${en(d.daDat)}</span></td>
            <td class="col-num text-right">
              <input type="number" min="0" value="${c}" placeholder="0" class="input h-8 w-24 text-right num"
                oninput="onQtyChange('${d.maHang}', this.value)">
            </td>
            <td class="col-num font-semibold text-brand-600 dark:text-brand-400" id="subtotal-${d.maHang}">${H(u)}</td>
          </tr>
        `}).join(""):e.innerHTML=""),n&&(l?n.innerHTML="":n.innerHTML=i.map(d=>{let c=d.soLuongDat||"",u=(d.soLuongDat||0)*(d.donGia||0);return`
          <div class="data-card space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  ${Jt(d.maHang)}
                  ${Yt("neutral",d.tenLoai||"CCDC")}
                  <span class="text-xs text-gray-500">\u0110VT: ${d.dvt||"C\xE1i"}</span>
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${d.tenSP}</h4>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <div>
                <span class="text-xs text-gray-400">\u0110\u01A1n gi\xE1:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${H(d.donGia)}</div>
              </div>
              <div>
                <span class="text-xs text-gray-400">\u0110\xE3 \u0111\u1EB7t l\u0169y k\u1EBF:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${en(d.daDat)}</div>
              </div>
              <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <div class="flex-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">S\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t:</label>
                  <input type="number" min="0" value="${c}" placeholder="0" class="input h-10 w-full text-center num text-sm font-semibold"
                    oninput="onQtyChange('${d.maHang}', this.value)">
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-400">Th\xE0nh ti\u1EC1n:</span>
                  <div class="text-base font-semibold text-brand-600 dark:text-brand-400 num" id="mob-subtotal-${d.maHang}">${H(u)}</div>
                </div>
              </div>
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Po(){He()}function Oo(e,n){let t=ee().find(o=>o.maHang===e);if(t){t.soLuongDat=Number(n)||0;let o=document.getElementById(`subtotal-${e}`);o&&(o.textContent=H(t.soLuongDat*(t.donGia||0)));let s=document.getElementById(`mob-subtotal-${e}`);s&&(s.textContent=H(t.soLuongDat*(t.donGia||0))),document.querySelectorAll(`input[oninput*="'${e}'"]`).forEach(r=>{r.value!==n&&(r.value=n)})}Ne()}function Ne(e,n){let a=document.getElementById("kpiNganSach"),t=document.getElementById("kpiDaDat"),o=e!==void 0?Number(e):Number(a?.dataset?.raw)||Number((a?.textContent||"").replace(/[^\d]/g,""))||0,s=n!==void 0?Number(n):Number(t?.dataset?.raw)||Number((t?.textContent||"").replace(/[^\d]/g,""))||0,i=ee().reduce((w,v)=>w+(v.soLuongDat||0)*(v.donGia||0),0),l=s+i,d=o-l,c=o>0?Math.round(l/o*100):0,u=document.getElementById("kpiConLai");u&&(u.dataset.raw=String(d),u.textContent=H(d),u.title=H(d),d<0?(u.classList.remove("text-gray-900","dark:text-white"),u.classList.add("text-rose-600","dark:text-rose-400")):(u.classList.remove("text-rose-600","dark:text-rose-400"),u.classList.add("text-gray-900","dark:text-white")));let f=document.getElementById("kpiDangNhapSub");f&&(f.textContent="\u0110ang nh\u1EADp: "+H(i));let h=document.getElementById("kpiConLaiDelta");h&&(d<0?(h.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",h.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>\xC2m h\u1EA1n m\u1EE9c</span>'):(h.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",h.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>Kh\u1EA3 d\u1EE5ng</span>'));let g=document.getElementById("kpiTyLe");g&&(g.textContent=c+"%",c>100?g.className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums tracking-tight num":c>80?g.className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums tracking-tight num":g.className="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-white tabular-nums tracking-tight num");let p=document.getElementById("budUsed");p&&(p.textContent=H(l));let m=document.getElementById("budFill"),y=document.getElementById("budBadge"),x=document.getElementById("budNote");m&&(m.style.width=Math.min(c,100)+"%",c>100?(m.className="h-full rounded-full bg-rose-500 transition-all duration-300",y&&(y.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",y.innerHTML=`<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>V\u01B0\u1EE3t ${c-100}%</span>`),x&&(x.innerHTML=`<span class="text-rose-600 dark:text-rose-400 font-semibold">\u26A0\uFE0F V\u01B0\u1EE3t \u0111\u1ECBnh m\u1EE9c ${c-100}%! C\u1EA7n gi\u1EA3i tr\xECnh.</span>`)):c>80?(m.className="h-full rounded-full bg-amber-500 transition-all duration-300",y&&(y.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50",y.innerHTML="<span>G\u1EA7n ch\u1EA1m tr\u1EA7n</span>"),x&&(x.textContent=`\u0110\xE3 d\xF9ng ${c}% ng\xE2n s\xE1ch. G\u1EA7n ch\u1EA1m m\u1EE9c gi\u1EDBi h\u1EA1n.`)):(m.className="h-full rounded-full bg-indigo-500 transition-all duration-300",y&&(y.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",y.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>An to\xE0n</span>'),x&&(x.textContent=`Ng\xE2n s\xE1ch an to\xE0n (${c}%).`)))}async function tn(){let e=window,n=localStorage.getItem("orbit_user_site")||e.gCurrentUser&&e.gCurrentUser.assignedSite||"K001",t=((typeof getAppSitesList=="function"?getAppSitesList():[])||e.App&&e.App.siteObjs||[]).find(d=>(d.code||"").toLowerCase()===n.toLowerCase()),o=t?t.ten||t.name:document.getElementById("orderSite")?.value||n,s=document.getElementById("orderSite");if(s&&(s.innerHTML=`<option value="${o}">${o}</option>`,s.value=o),!o)return;let r=document.getElementById("globalMonthPicker")?.value,i=document.getElementById("orderMonth")?.value;if(!i||r&&i!==r){i=r||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;let d=document.getElementById("orderMonth");d&&(d.value=i)}let l="";if(i){let d=i.split("-");l=`${d[1]}/${d[0]}`}typeof showLoading=="function"&&showLoading("T\u1EA3i danh s\xE1ch v\u1EADt t\u01B0 theo Site...");try{let c=await(await fetch(`/api/quota?site=${encodeURIComponent(o)}&thang=${encodeURIComponent(l)}&refresh=true`)).json();if(c.success){ut(c.data.items||[]);let u=document.getElementById("kpiNganSach");u&&(u.dataset.raw=String(c.data.nganSach),u.textContent=H(c.data.nganSach),u.title=H(c.data.nganSach));let f=document.getElementById("kpiSubSite");f&&(f.textContent=c.data.site||o,f.title=c.data.site||o);let h=document.getElementById("kpiDaDat");h&&(h.dataset.raw=String(c.data.tienDaDat),h.textContent=H(c.data.tienDaDat),h.title=H(c.data.tienDaDat));let g=document.getElementById("budTotal");g&&(g.textContent=H(c.data.nganSach));let p=ee(),m=Array.from(new Set(p.map(x=>x.tenLoai).filter(Boolean))),y=document.getElementById("fLoai");y&&(y.innerHTML='<option value="">T\u1EA5t c\u1EA3 lo\u1EA1i NVL</option>'+m.map(x=>`<option value="${x}">${x}</option>`).join("")),He(),Ne(c.data.nganSach,c.data.tienDaDat),e.lucide&&e.lucide.createIcons&&e.lucide.createIcons()}else typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i \u0111\u1ECBnh m\u1EE9c: "+(c.error||""))}catch(d){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+(d?.message||d))}finally{typeof hideLoading=="function"&&hideLoading()}}function jo(){let n=ee().filter(r=>(r.soLuongDat||0)>0);if(!n.length){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng cho \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng.");return}let a=document.getElementById("orderSite")?.value||"",t=document.getElementById("orderMonth")?.value||"",o=n.reduce((r,i)=>r+(i.soLuongDat||0)*(i.donGia||0),0),s=`
    <div class="space-y-3">
      <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
        <div>Site \u0111\u1EB7t: <b>${a}</b></div>
        <div>Th\xE1ng: <b>${t}</b></div>
        <div>T\u1ED5ng ti\u1EC1n \u0111\u01A1n: <b class="text-brand-700 tabular-nums text-sm">${H(o)}</b></div>
      </div>
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto max-h-56 rounded-xl border border-gray-200 dark:border-gray-800">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
          <tbody>
            ${n.map(r=>`
              <tr><td class="p-2 tabular-nums">${r.maHang}</td><td class="p-2">${r.tenSP}</td><td class="p-2 text-right tabular-nums font-bold">${r.soLuongDat}</td><td class="p-2 text-right tabular-nums">${H((r.soLuongDat||0)*r.donGia)}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <!-- Mobile Order Items Cards -->
      <div class="block sm:hidden space-y-2 max-h-56 overflow-y-auto">
        ${n.map(r=>`
          <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
            <div class="min-w-0">
              <div class="font-bold text-gray-900 dark:text-white truncate">${Zt(r.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${Zt(r.maHang)}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${r.soLuongDat}</div>
              <div class="num text-[11px] text-gray-500">${H((r.soLuongDat||0)*r.donGia)}</div>
            </div>
          </div>
        `).join("")}
      </div>
      <div>
        <label class="font-bold block mb-1">Ghi ch\xFA / Gi\u1EA3i tr\xECnh:</label>
        <textarea id="orderNote" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder="Ghi ch\xFA \u0111\u01A1n h\xE0ng..."></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="closeGeneralModal()" class="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 font-bold">Xem l\u1EA1i</button>
        <button onclick="submitOrder()" class="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm">G\u1EEDi \u0111\u01A1n \u0111\u1EB7t h\xE0ng</button>
      </div>
    </div>
  `;typeof openGeneralModal=="function"&&openGeneralModal("X\xE1c nh\u1EADn \u0111\u1EB7t h\xE0ng v\u1EADt t\u01B0",s)}async function Vo(){let e=window,n=ee(),a=n.filter(i=>(i.soLuongDat||0)>0),t=document.getElementById("orderSite")?.value||"",o=document.getElementById("orderMonth")?.value||"",s=document.getElementById("orderNote"),r=s?s.value:"";typeof showLoading=="function"&&showLoading("L\u01B0u \u0111\u01A1n h\xE0ng v\xE0o Cloudflare D1...");try{let i={site:t,thang:o,nguoiDat:e.App&&e.App.user?e.App.user.email:"B\u1EBFp tr\u01B0\u1EDFng Site",ghiChu:r,items:a.map(c=>({maHang:c.maHang,tenSP:c.tenSP,dvt:c.dvt,donGia:c.donGia,soLuong:c.soLuongDat||0,daDat:c.daDat}))},d=await(await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();d.success?(typeof closeGeneralModal=="function"&&closeGeneralModal(),typeof showToast=="function"&&showToast(`\u0110\xE3 t\u1EA1o \u0111\u01A1n h\xE0ng th\xE0nh c\xF4ng! M\xE3: ${d.data.maDon}`),n.forEach(c=>{c.soLuongDat=0}),tn()):typeof showToast=="function"&&showToast("L\u1ED7i: "+d.error)}catch(i){typeof showToast=="function"&&showToast("L\u1ED7i: "+(i?.message||i))}finally{typeof hideLoading=="function"&&hideLoading()}}var te=window;te.loadQuota=tn;te.renderOrderTable=He;te.filterItems=Po;te.onQtyChange=Oo;te.calcBudget=Ne;te.reviewOrder=jo;te.submitOrder=Vo;te.getAppOrderItems=ee;te.setAppOrderItems=ut;function nn(e){return typeof window.cellCode=="function"?window.cellCode(e):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${e}</span>`}function Uo(e){return typeof window.cellDate=="function"?window.cellDate(e):`<span class="tabular-nums text-xs text-gray-500">${ne(e)}</span>`}function on(e){return typeof window.cellPerson=="function"?window.cellPerson(e):`<span class="text-xs font-medium text-gray-700 dark:text-gray-300">${I(e||"\u2014")}</span>`}function an(e,n){return typeof window.cellBadge=="function"?window.cellBadge(e,n):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${n}</span>`}function I(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function P(e){return typeof window.fmtVND=="function"?window.fmtVND(e):E(Number(e)||0)}function Le(e){return typeof window.fmtNum=="function"?window.fmtNum(e):T(Number(e)||0)}function ne(e){return e?typeof window.fmtDate=="function"?window.fmtDate(e):Y(e):"\u2014"}function oe(e){let n=window,a=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!a)return!1;if(a.role==="ADMIN"||a.role==="KHO_TRUONG"||a.role==="SUPER_ADMIN")return!0;if(a.permissions&&typeof a.permissions=="object"){let t=a.permissions["portal-history"],o=a.permissions["portal-order"];if(t&&t.canEdit!==void 0)return!!t.canEdit;if(o&&o.canEdit!==void 0)return!!o.canEdit}if(a.role==="BEP_TRUONG"){if(!e)return!0;let t=(e.trangThai||e.status||"").toUpperCase();return t.includes("M\u1EDAI")||t.includes("CH\u1EDC")||t.includes("PENDING")||t===""}return!1}function ae(e){let n=window,a=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!a)return!1;if(a.role==="ADMIN"||a.role==="KHO_TRUONG"||a.role==="SUPER_ADMIN")return!0;if(a.permissions&&typeof a.permissions=="object"){let t=a.permissions["portal-history"],o=a.permissions["portal-order"];if(t&&t.canDelete!==void 0)return!!t.canDelete;if(o&&o.canDelete!==void 0)return!!o.canDelete}if(a.role==="BEP_TRUONG"){if(!e)return!0;let t=(e.trangThai||e.status||"").toUpperCase();return t.includes("M\u1EDAI")||t.includes("CH\u1EDC")||t.includes("PENDING")||t===""}return!1}function pt(e){let n=window,a=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!a)return!1;if(a.role==="ADMIN"||a.role==="KHO_TRUONG"||a.role==="SUPER_ADMIN")return!0;if(a.permissions&&typeof a.permissions=="object"){let t=a.permissions["portal-history"],o=a.permissions["portal-order"];if(t&&(t.canAuthenticate!==void 0||t.canVerify!==void 0||t.canEdit!==void 0))return!!(t.canAuthenticate||t.canVerify||t.canEdit);if(o&&(o.canAuthenticate!==void 0||o.canVerify!==void 0||o.canEdit!==void 0))return!!(o.canAuthenticate||o.canVerify||o.canEdit)}return!1}function gt(e,n,a){let t=Number(e)||1,s=n||{1:"Site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn",3:"Chuy\u1EC3n Tr\u01B0\u1EDFng Kho",4:"Mail cho PMH",5:"PMH \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"\u0110\xE3 giao v\u1EC1 site"}[t]||`B\u01B0\u1EDBc ${t}`,r="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",i="bg-blue-500";return t>=7?(r="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",i="bg-emerald-500"):t>=4?(r="bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",i="bg-indigo-500"):t>=2&&(r="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",i="bg-amber-500"),`
    <button type="button" onclick="openOrderJourneyModal('${a}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${r} hover:shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer" title="B\u1EA5m \u0111\u1EC3 xem v\xE0 x\xE1c th\u1EF1c h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng">
      <span class="w-1.5 h-1.5 rounded-full ${i} animate-pulse shrink-0"></span>
      <span class="font-mono text-[11px] font-bold shrink-0">B${t}/7:</span>
      <span class="truncate max-w-[100px] text-left">${I(s)}</span>
    </button>
  `}function mt(e){let n=document.getElementById("hsBody"),a=document.getElementById("hsMobileCards");if(!e||!e.length){n&&(n.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),a&&(a.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}n&&(n.innerHTML=e.map(t=>{let o=oe(t),s=ae(t);return`
        <tr>
          <td class="col-code min-w-[130px]">${nn(t.maDon)}</td>
          <td class="col-date min-w-[110px]">${Uo(t.ngayDat)}</td>
          <td class="min-w-[260px] max-w-[360px]">
            <div class="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-normal leading-snug break-words">
              ${I(t.site||"\u2014")}
            </div>
          </td>
          <td class="min-w-[130px]">${on(t.nguoiDat)}</td>
          <td class="col-num">${t.soDong}</td>
          <td class="col-num font-medium">${Le(t.tongSL)}</td>
          <td class="col-num font-semibold text-brand-600 dark:text-brand-400">${P(t.tongTien)}</td>
          <td class="col-badge min-w-[140px] text-center">${an("neutral",t.trangThai||"M\u1EDBi t\u1EA1o")}</td>
          <td class="text-center min-w-[170px]">
            ${gt(t.currentStep,t.currentStepName,t.maDon)}
          </td>
          <td class="col-actions min-w-[220px]">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="viewOrderDetail('${t.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs hover:border-slate-400 dark:hover:border-gray-600 transition" title="Xem chi ti\u1EBFt \u0111\u01A1n h\xE0ng">
                <svg class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>Xem</span>
              </button>
              <button onclick="openOrderJourneyModal('${t.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition" title="Theo d\xF5i & X\xE1c th\u1EF1c h\xE0nh tr\xECnh">
                <svg class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                <span>H\xE0nh tr\xECnh</span>
              </button>
              ${o?`
                <button onclick="openEditOrderModal('${t.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition" title="Ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>S\u1EEDa</span>
                </button>
              `:""}
              ${s?`
                <button onclick="confirmDeleteOrder('${t.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition" title="X\xF3a \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a</span>
                </button>
              `:""}
            </div>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=e.map(t=>{let o=oe(t),s=ae(t);return`
        <div class="data-card space-y-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            ${nn(t.maDon)}
            ${an("neutral",t.trangThai||"M\u1EDBi t\u1EA1o")}
          </div>
          <div class="font-bold text-sm text-gray-900 dark:text-white leading-snug break-words">
            ${I(t.site||"\u2014")}
          </div>
          <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Ti\u1EBFn \u0111\u1ED9:</span>
            </div>
            ${gt(t.currentStep,t.currentStepName,t.maDon)}
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="num text-gray-900 dark:text-white whitespace-nowrap">${ne(t.ngayDat)}</b></div>
            <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b>${on(t.nguoiDat)}</b></div>
            <div>S\u1ED1 m\u1EB7t h\xE0ng: <b class="num text-gray-900 dark:text-white">${t.soDong} d\xF2ng</b></div>
            <div>T\u1ED5ng SL: <b class="num text-gray-900 dark:text-white">${Le(t.tongSL)}</b></div>
            <div class="col-span-2 flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <span class="text-gray-500 font-medium">T\u1ED5ng gi\xE1 tr\u1ECB \u0111\u01A1n:</span>
              <span class="num font-semibold text-sm text-brand-600 dark:text-brand-400">${P(t.tongTien)}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewOrderDetail('${t.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span>Chi ti\u1EBFt</span>
            </button>
            <button onclick="openOrderJourneyModal('${t.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>H\xE0nh tr\xECnh</span>
            </button>
            ${o?`
              <button onclick="openEditOrderModal('${t.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>S\u1EEDa</span>
              </button>
            `:""}
            ${s?`
              <button onclick="confirmDeleteOrder('${t.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>X\xF3a</span>
              </button>
            `:""}
          </div>
        </div>
      `}).join(""))}function rn(e){let n=window,a=n.App&&n.App.historyOrders?n.App.historyOrders:[];if(!e||e==="ALL"){mt(a);return}let t=a.filter(o=>{let s=(o.trangThai||"").toUpperCase();return e==="APPROVED"?s.includes("DUY\u1EC6T")||s.includes("APPROVED"):e==="PENDING"?s.includes("CH\u1EDC")||s.includes("T\u1EA0O")||s.includes("PENDING"):e==="DELIVERED"?s.includes("NH\u1EACN")||s.includes("GIAO")||s.includes("DELIVERED"):e==="REJECTED"?s.includes("H\u1EE6Y")||s.includes("T\u1EEA CH\u1ED0I")||s.includes("REJECT"):!0});mt(t)}async function Wo(){let e=window,n=document.getElementById("globalBranchSelect")?.value,a=e.gCurrentUser||(typeof e.loadPersistedUser=="function"?e.loadPersistedUser():null),t=a?a.assignedSite:"",o=localStorage.getItem("orbit_user_site"),s=document.getElementById("hsSite")?.value,r="";n?r=n==="ALL"?"":n:t?r=t==="ALL"?"":t:o?r=o==="ALL"?"":o:s&&(r=s==="ALL"?"":s);let i=document.getElementById("hsCurrentSiteBadge");if(i){if(r&&r!=="ALL"){let f=((typeof e.getAppSitesList=="function"?e.getAppSitesList():[])||[]).find(h=>h.code.toUpperCase()===r.toUpperCase()||h.name===r||h.ten&&h.ten===r);i.textContent=f?f.ten||f.name:r}else i.textContent="T\u1EA5t c\u1EA3 \u0111i\u1EC3m b\xE1n";i.classList.remove("hidden")}let l=document.getElementById("hsSite");l&&(l.value=r);let d=document.getElementById("hsMonth")?.value||"",c="";if(d){let u=d.split("-");c=`${u[1]}/${u[0]}`}try{typeof showLoading=="function"&&showLoading("T\u1EA3i l\u1ECBch s\u1EED \u0111\u01A1n h\xE0ng...");let u=`/api/orders?site=${encodeURIComponent(r)}&thang=${encodeURIComponent(c)}&_t=${Date.now()}`,h=await(await fetch(u,{cache:"no-store",headers:{"Cache-Control":"no-cache",Pragma:"no-cache"}})).json();e.App||(e.App={}),e.App.historyOrders=h.success&&h.data?h.data:[];let g=document.getElementById("hsOrderStatusFilter")?.value||"ALL";rn(g)}catch(u){console.error("loadHistory error:",u)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}async function Ko(e){typeof showLoading=="function"&&showLoading("T\u1EA3i chi ti\u1EBFt \u0111\u01A1n...");try{let a=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(e)}`)).json();if(a.success){let{info:t,items:o,timeline:s}=a.data,r=`
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
            <div>
              <div class="tabular-nums font-bold">${t.order_code}</div>
              <div class="text-gray-500 dark:text-gray-400">${t.site_name} \xB7 ${t.ordered_by}</div>
            </div>
            <button onclick="if(typeof exportSingleOrderExcel==='function')exportSingleOrderExcel('${t.order_code}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1">
              Xu\u1EA5t Excel
            </button>
          </div>
          <!-- Desktop Table -->
          <div class="hidden sm:block overflow-x-auto max-h-48 rounded-xl border border-gray-200 dark:border-gray-800">
            <table class="data-table">
              <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2">\u0110VT</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">\u0110\u01A1n gi\xE1</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
              <tbody>
                ${(o||[]).map(i=>`<tr><td class="p-2 tabular-nums">${i.maHang}</td><td class="p-2">${i.tenSP}</td><td class="p-2">${i.dvt}</td><td class="p-2 text-right tabular-nums font-bold">${i.soLuong}</td><td class="p-2 text-right tabular-nums">${P(i.donGia)}</td><td class="p-2 text-right tabular-nums font-bold">${P(i.thanhTien)}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>

          <!-- Native Mobile Cards for Order Details -->
          <div class="block sm:hidden space-y-2 max-h-48 overflow-y-auto">
            ${(o||[]).map(i=>`
              <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
                <div class="min-w-0">
                  <div class="font-bold text-gray-900 dark:text-white truncate">${I(i.tenSP)}</div>
                  <div class="font-mono text-[11px] text-gray-400">${I(i.maHang)} \xB7 <span class="font-sans">${I(i.dvt||"")}</span></div>
                </div>
                <div class="text-right shrink-0">
                  <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${i.soLuong}</div>
                  <div class="num text-[11px] text-gray-500">${P(i.thanhTien)}</div>
                </div>
              </div>
            `).join("")}
          </div>
          <div class="pt-2">
            <div class="flex items-center justify-between mb-2">
              <b class="text-gray-900 dark:text-white flex items-center gap-1.5">
                <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                H\xE0nh tr\xECnh x\u1EED l\xFD \u0111\u01A1n h\xE0ng:
              </b>
              <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${t.order_code}')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
                <span>Xem & X\xE1c th\u1EF1c chi ti\u1EBFt</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div class="space-y-2 border-l-2 border-indigo-200 dark:border-indigo-800/80 pl-3">
              ${(s||[]).map(i=>`
                <div class="p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
                  <div class="flex justify-between font-bold text-gray-800 dark:text-gray-100">
                    <span>B\u01B0\u1EDBc ${i.buoc}: ${i.tenBuoc}</span>
                    <span class="tabular-nums text-gray-400 dark:text-gray-500 font-normal">${i.thoiGian?ne(i.thoiGian):""}</span>
                  </div>
                  <div class="text-gray-500 dark:text-gray-400 mt-0.5">${i.nguoiXuLy||"H\u1EC7 th\u1ED1ng"} \xB7 Tr\u1EA1ng th\xE1i: <span class="font-bold text-brand-700 dark:text-brand-400">${i.trangThai}</span>${i.ghiChu?` \xB7 <span class="italic text-gray-600 dark:text-gray-300">"${I(i.ghiChu)}"</span>`:""}</div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${t.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>H\xE0nh tr\xECnh \u0111\u01A1n</span>
            </button>
            <div class="flex items-center gap-2">
              ${oe(t)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openEditOrderModal('${t.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>Ch\u1EC9nh s\u1EEDa \u0111\u01A1n</span>
                </button>
              `:""}
              ${ae(t)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); confirmDeleteOrder('${t.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a \u0111\u01A1n h\xE0ng</span>
                </button>
              `:""}
            </div>
          </div>
        </div>
      `;typeof openGeneralModal=="function"&&openGeneralModal(`\u0110\u01A1n h\xE0ng ${e}`,r)}}catch(n){typeof showToast=="function"&&showToast("L\u1ED7i: "+(n?.message||n))}finally{typeof hideLoading=="function"&&hideLoading()}}var Go=null,Xo=null,ht=[{step:1,name:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",desc:"\u0110i\u1EC3m b\xE1n t\u1EA1o phi\u1EBFu \u0111\u1EB7t h\xE0ng th\xE0nh c\xF4ng qua h\u1EC7 th\u1ED1ng Portal"},{step:2,name:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",desc:"Admin/B\u1ED9 ph\u1EADn \u0111i\u1EC1u ph\u1ED1i ki\u1EC3m tra \u0111\u1ECBnh m\u1EE9c & duy\u1EC7t ti\u1EBFp nh\u1EADn \u0111\u01A1n"},{step:3,name:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",desc:"Th\u1EE7 kho ti\u1EBFp nh\u1EADn y\xEAu c\u1EA7u, ph\xE2n lo\u1EA1i v\xE0 chu\u1EA9n b\u1ECB k\u1EBF ho\u1EA1ch so\u1EA1n"},{step:4,name:"Kho mail cho PMH",desc:"Kho ph\u1ED1i h\u1EE3p ph\xF2ng mua h\xE0ng ho\u1EB7c nh\xE0 cung c\u1EA5p ki\u1EC3m tra t\u1ED3n kho"},{step:5,name:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",desc:"Ph\xF2ng mua h\xE0ng x\xE1c nh\u1EADn \u0111\u01A1n h\xE0ng v\u1EDBi NCC ho\u1EB7c xu\u1EA5t kho t\u1ED5ng"},{step:6,name:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",desc:"H\xE0ng h\xF3a t\u1EADp k\u1EBFt, ki\u1EC3m \u0111\u1EBFm ch\u1EA5t l\u01B0\u1EE3ng v\xE0 \u0111\xF3ng g\xF3i chuy\u1EC3n \u0111i"},{step:7,name:"Kho giao v\u1EC1 c\xE1c site",desc:"\u0110ang v\u1EADn chuy\u1EC3n giao v\u1EC1 \u0111i\u1EC3m b\xE1n / B\u1EBFp tr\u01B0\u1EDFng k\xFD nh\u1EADn \u0111\u1EE7"}];function ft(e,n){let a=document.getElementById("journeyTimelineContainer");if(!a)return;let t=document.getElementById("journeyCurrentStepText"),o={};(n||[]).forEach(i=>{let l=Number(i.buoc);l&&(o[l]=i)});let s=Object.keys(o).map(Number),r=s.length?Math.max(...s):1;t&&(t.textContent=`B\u01B0\u1EDBc ${r}/7 (${ht[r-1]?.name||""})`),a.innerHTML=ht.map(i=>{let l=o[i.step],d=l&&(l.trangThai==="Ho\xE0n th\xE0nh"||l.trangThai==="Ho\xE0n t\u1EA5t"),c=i.step===r||l&&!d,u="bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700",f=`<span class="font-mono text-xs font-bold">${i.step}</span>`,h="border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/60",g="text-gray-500 dark:text-gray-400 font-medium",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Ch\u1EDD x\u1EED l\xFD</span>';return d?(u="bg-emerald-600 text-white border-emerald-600 shadow-sm",f='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>',h="border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20",g="text-emerald-900 dark:text-emerald-200 font-bold",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>\u0110\xE3 ho\xE0n th\xE0nh</span>'):c&&(u="bg-indigo-600 text-white border-indigo-600 shadow-sm ring-4 ring-indigo-100 dark:ring-indigo-950/60",f='<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg>',h="border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-200 dark:ring-indigo-800/50",g="text-indigo-900 dark:text-indigo-100 font-bold",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>\u0110ang x\u1EED l\xFD</span>'),`
      <div class="relative flex items-start gap-3 group">
        <div class="absolute -left-[27px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${u}">
          ${f}
        </div>
        <div class="flex-1 p-3 rounded-xl border ${h} shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs ${g}">B\u01B0\u1EDBc ${i.step}: ${I(l?.tenBuoc||i.name)}</span>
            ${p}
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">${I(i.desc)}</p>
          ${l?`
            <div class="pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div class="text-gray-600 dark:text-gray-300">
                Ng\u01B0\u1EDDi x\u1EED l\xFD: <b class="text-gray-900 dark:text-white">${I(l.nguoiXuLy||"H\u1EC7 th\u1ED1ng")}</b>
              </div>
              <div class="text-gray-400 dark:text-gray-500 font-mono">
                ${l.thoiGian?ne(l.thoiGian):""}
              </div>
              ${l.ghiChu?`
                <div class="w-full text-gray-700 dark:text-gray-300 italic bg-white/70 dark:bg-gray-800/60 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                  " ${I(l.ghiChu)} "
                </div>
              `:""}
            </div>
          `:""}
        </div>
      </div>
    `}).join("")}async function qo(e){if(!e)return;Go=e,window._currentJourneyOrderCode=e;let n=document.getElementById("modalOrderJourney");if(!n)return;let a=document.getElementById("journeyOrderSubtitle");a&&(a.textContent=`M\xE3 \u0111\u01A1n: ${e}`),typeof showLoading=="function"&&showLoading("T\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng...");try{let o=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(e)}&_t=${Date.now()}`)).json();if(!o.success||!o.data){typeof showToast=="function"&&showToast(o.error||"Kh\xF4ng th\u1EC3 t\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng","error");return}let{info:s,timeline:r}=o.data;Xo=o.data,window._currentJourneyData=o.data;let i=document.getElementById("journeySiteName");i&&(i.textContent=s.site_name||s.site||"\u2014");let l=document.getElementById("journeyOrderedBy");l&&(l.textContent=s.ordered_by||"\u2014");let d=document.getElementById("journeyOrderDate");d&&(d.textContent=ne(s.order_date||""));let c=document.getElementById("journeyBadgeStatus");c&&(c.textContent=s.status||"\u0110ang x\u1EED l\xFD"),ft(s,r||[]);let u=pt(s),f=document.getElementById("journeyAdminSection");if(f)if(u){f.classList.remove("hidden");let h=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,g=document.getElementById("journeyAdminActor");g&&(g.textContent=h&&(h.fullName||h.email)||"Qu\u1EA3n tr\u1ECB vi\xEAn");let p=r&&r.length?Math.max(...r.map(w=>Number(w.buoc)||1)):1,m=Math.min(p+1,7),y=document.getElementById("journeySelectStep");y&&(y.value=String(m));let x=document.getElementById("journeyStepNote");x&&(x.value="")}else f.classList.add("hidden");n.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(t){console.error("Error openOrderJourneyModal:",t),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi t\u1EA3i h\xE0nh tr\xECnh","error")}finally{typeof hideLoading=="function"&&hideLoading()}}function zo(){let e=document.getElementById("modalOrderJourney");e&&e.classList.add("hidden")}async function Qo(){let e=Go||window._currentJourneyOrderCode;if(!e)return;let n=document.getElementById("journeySelectStep"),a=document.getElementById("journeyStepStatus"),t=document.getElementById("journeyStepNote"),o=document.getElementById("btnSubmitJourneyStep"),s=Number(n?n.value:1),r=a?a.value:"Ho\xE0n th\xE0nh",i=t?t.value.trim():"",l=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,d=l&&(l.fullName||l.email)||"Admin",u={1:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",3:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",4:"Kho mail cho PMH",5:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"Kho giao v\u1EC1 c\xE1c site"}[s]||`B\u01B0\u1EDBc ${s}`;try{o&&(o.disabled=!0,o.innerHTML='<span class="inline-block animate-spin mr-1">\u23F3</span> \u0110ang l\u01B0u...');let h=await(await fetch("/api/order-journey",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:e,step:s,stepName:u,status:r,note:i,actor:d})})).json();if(!h.success){typeof showToast=="function"&&showToast(h.error||"C\u1EADp nh\u1EADt b\u01B0\u1EDBc h\xE0nh tr\xECnh th\u1EA5t b\u1EA1i","error");return}if(typeof showToast=="function"&&showToast(`\u0110\xE3 x\xE1c th\u1EF1c th\xE0nh c\xF4ng B\u01B0\u1EDBc ${s}: ${u}`,"success"),h.data&&h.data.timeline){let g=Xo?.info||window._currentJourneyData?.info||{order_code:e};g.status=h.data.orderStatus;let p=document.getElementById("journeyBadgeStatus");p&&(p.textContent=g.status),ft(g,h.data.timeline),n&&s<7&&(n.value=String(s+1)),t&&(t.value="")}typeof window.loadHistory=="function"&&window.loadHistory()}catch(f){console.error("Error submitJourneyStep:",f),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi c\u1EADp nh\u1EADt ti\u1EBFn \u0111\u1ED9","error")}finally{o&&(o.disabled=!1,o.innerHTML='<i data-lucide="check" class="w-3.5 h-3.5"></i><span>X\xE1c nh\u1EADn c\u1EADp nh\u1EADt b\u01B0\u1EDBc n\xE0y</span>',typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons())}}var A=[],sn=null;async function Jo(e){if(!oe()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}typeof showLoading=="function"&&showLoading("\u0110ang t\u1EA3i th\xF4ng tin \u0111\u01A1n h\xE0ng...");try{let a=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(e)}&_t=${Date.now()}`)).json();if(!a.success||!a.data)throw new Error(a.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n h\xE0ng");let{info:t,items:o}=a.data,s=document.getElementById("editOrderCode");s&&(s.value=t.order_code||e);let r=document.getElementById("editOrderSubtitle");r&&(r.textContent=`M\xE3 \u0111\u01A1n: ${t.order_code||e}`);let i=document.getElementById("editOrderSite");if(i){let p=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[])||[];i.innerHTML=p.map(m=>{let y=m.ten||m.name||m.code||m,x=t.site_name===y||t.site_name===m.name||t.site_name===m.code?"selected":"";return`<option value="${y}" ${x}>${y}</option>`}).join(""),t.site_name&&!p.some(m=>(m.ten||m.name||m.code)===t.site_name)&&i.insertAdjacentHTML("afterbegin",`<option value="${t.site_name}" selected>${t.site_name}</option>`)}let l=document.getElementById("editOrderDate");l&&(l.value=(t.order_date||"").slice(0,10));let d=document.getElementById("editOrderStatus");d&&(d.value=t.status||"M\u1EDBi t\u1EA1o");let c=document.getElementById("editOrderNguoiDat");c&&(c.value=t.ordered_by||"");let u=document.getElementById("editOrderThang");u&&(u.value=t.applied_month||"");let f=document.getElementById("editOrderGhiChu");f&&(f.value=""),A=(o||[]).map(p=>({maHang:p.maHang||p.item_code,tenSP:p.tenSP||p.item_name,dvt:p.dvt||p.unit||"Ph\u1EA7n",soLuong:Number(p.soLuong??p.order_qty??1),donGia:Number(p.donGia??p.unit_price??0),thanhTien:Number(p.thanhTien??(p.soLuong||1)*(p.donGia||0)),ghiChu:p.ghiChu||""})),window._editOrderItems=A;let h=document.getElementById("editOrderAddSelect");if(h){let p=window,m=p.App&&p.App.items&&p.App.items.length?p.App.items:[];if(!m.length)try{let x=await(await fetch(`/api/quota?site=${encodeURIComponent(t.site_name||"K001")}&thang=${encodeURIComponent(t.applied_month||"")}`)).json();x.success&&x.data?.items&&(m=x.data.items,p.App&&(p.App.items=m))}catch{}h.innerHTML='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng mu\u1ED1n th\xEAm --</option>'+m.map(y=>`
          <option value="${I(y.maHang||y.code)}" 
                  data-name="${I(y.tenHang||y.tenSP||y.name||"")}" 
                  data-unit="${I(y.dvt||y.unit||"Ph\u1EA7n")}" 
                  data-price="${Number(y.donGia||y.price||0)}">
            [${I(y.maHang||y.code)}] ${I(y.tenHang||y.tenSP||y.name||"")} (${P(y.donGia||y.price||0)}/${y.dvt||y.unit||""})
          </option>
        `).join("")}Te();let g=document.getElementById("modalEditOrder");g&&g.classList.remove("hidden")}catch(n){console.error("openEditOrderModal error:",n),typeof showToast=="function"&&showToast("L\u1ED7i: "+(n?.message||n),"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}function dn(){let e=document.getElementById("modalEditOrder");e&&e.classList.add("hidden"),A=[],window._editOrderItems=[]}function Te(){let e=document.getElementById("editOrderItemsBody"),n=document.getElementById("editOrderItemsMobile"),a=A;e&&(a.length?e.innerHTML=a.map((t,o)=>`
        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
          <td class="p-2.5 text-center text-gray-400 font-mono">${o+1}</td>
          <td class="p-2.5 font-mono font-medium text-gray-900 dark:text-white">${I(t.maHang)}</td>
          <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">${I(t.tenSP)}</td>
          <td class="p-2.5 text-center text-gray-500">${I(t.dvt)}</td>
          <td class="p-2.5 text-right">
            <input type="number" min="0.1" step="0.5" value="${t.soLuong}" 
                   onchange="updateEditOrderItemQty(${o}, this.value)" 
                   class="w-20 px-2 py-1 text-right font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-500">
          </td>
          <td class="p-2.5 text-right font-mono text-gray-500">${P(t.donGia)}</td>
          <td class="p-2.5 text-right font-mono font-bold text-brand-600 dark:text-brand-400">${P(t.soLuong*t.donGia)}</td>
          <td class="p-2.5 text-center">
            <button type="button" onclick="removeEditOrderItemLine(${o})" class="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors" title="X\xF3a d\xF2ng">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </td>
        </tr>
      `).join(""):e.innerHTML='<tr><td colspan="8" class="p-4 text-center text-gray-400">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o. Vui l\xF2ng th\xEAm m\u1EB7t h\xE0ng b\xEAn d\u01B0\u1EDBi.</td></tr>'),n&&(a.length?n.innerHTML=a.map((t,o)=>`
        <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-bold text-gray-900 dark:text-white">${I(t.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${I(t.maHang)} \xB7 <span class="font-sans">${I(t.dvt)}</span></div>
            </div>
            <button type="button" onclick="removeEditOrderItemLine(${o})" class="p-1 text-rose-500 hover:text-rose-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-200 dark:border-gray-700/60">
            <div class="flex items-center gap-1.5">
              <span class="text-gray-500">S\u1ED1 l\u01B0\u1EE3ng:</span>
              <input type="number" min="0.1" step="0.5" value="${t.soLuong}" 
                     onchange="updateEditOrderItemQty(${o}, this.value)" 
                     class="w-16 px-1.5 py-0.5 text-center font-mono font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
            </div>
            <div class="text-right">
              <div class="font-mono font-bold text-brand-600 dark:text-brand-400">${P(t.soLuong*t.donGia)}</div>
            </div>
          </div>
        </div>
      `).join(""):n.innerHTML='<div class="p-4 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o</div>'),ln()}function Yo(e,n){let a=Math.max(0,Number(n)||0);A&&A[e]&&(A[e].soLuong=a,A[e].thanhTien=a*(A[e].donGia||0),Te())}function Zo(e){A&&A.length>e&&(A.splice(e,1),Te())}function ea(){let e=document.getElementById("editOrderAddSelect"),n=document.getElementById("editOrderAddQty");if(!e||!e.value){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t m\u1EB7t h\xE0ng \u0111\u1EC3 th\xEAm","warning");return}let a=e.value,t=e.selectedOptions[0],o=t.getAttribute("data-name")||a,s=t.getAttribute("data-unit")||"Ph\u1EA7n",r=Number(t.getAttribute("data-price"))||0,i=Math.max(.1,Number(n?n.value:1)||1),l=A.find(d=>d.maHang===a);l?(l.soLuong+=i,l.thanhTien=l.soLuong*l.donGia):A.push({maHang:a,tenSP:o,dvt:s,soLuong:i,donGia:r,thanhTien:i*r,ghiChu:""}),e.value="",n&&(n.value="1"),Te()}function ln(){let e=A,n=0,a=0;e.forEach(r=>{n+=Number(r.soLuong)||0,a+=(Number(r.soLuong)||0)*(Number(r.donGia)||0)});let t=document.getElementById("editOrderItemsCount");t&&(t.textContent=String(e.length));let o=document.getElementById("editOrderTotalQty");o&&(o.textContent=Le(n));let s=document.getElementById("editOrderTotalAmount");s&&(s.textContent=P(a))}async function ta(){if(!oe()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}let e=document.getElementById("editOrderCode")?.value;if(!e){typeof showToast=="function"&&showToast("Thi\u1EBFu m\xE3 \u0111\u01A1n h\xE0ng","error");return}let n=document.getElementById("editOrderSite")?.value,a=document.getElementById("editOrderDate")?.value,t=document.getElementById("editOrderStatus")?.value,o=document.getElementById("editOrderNguoiDat")?.value,s=document.getElementById("editOrderThang")?.value,r=document.getElementById("editOrderGhiChu")?.value,i=A.filter(d=>(Number(d.soLuong)||0)>0);if(!i.length){typeof showToast=="function"&&showToast("\u0110\u01A1n h\xE0ng ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng c\xF3 s\u1ED1 l\u01B0\u1EE3ng > 0","warning");return}let l=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser;typeof showLoading=="function"&&showLoading("\u0110ang l\u01B0u c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng...");try{let c=await(await fetch("/api/order",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:e,site:n,orderDate:a,status:t,orderedBy:o,month:s,ghiChu:r,actor:l?l.full_name||l.fullName||l.email:"Ng\u01B0\u1EDDi qu\u1EA3n tr\u1ECB",items:i})})).json();if(!c.success)throw new Error(c.error||"C\u1EADp nh\u1EADt th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng ${e} th\xE0nh c\xF4ng!`,"success"),dn(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(d){console.error("saveEditOrder error:",d),typeof showToast=="function"&&showToast("L\u1ED7i l\u01B0u \u0111\u01A1n h\xE0ng: "+(d?.message||d),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}async function na(e){if(!ae()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning");return}sn=e,window._pendingDeleteOrderCode=e;let n=document.getElementById("confirmDeleteOrderCode");n&&(n.textContent=e);let a=document.getElementById("confirmDeleteOrderInfo");a&&(a.innerHTML='<span class="text-gray-400">\u0110ang t\u1EA3i chi ti\u1EBFt \u0111\u01A1n...</span>');let t=document.getElementById("modalConfirmDeleteOrder");t&&t.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();try{let s=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(e)}&_t=${Date.now()}`)).json();if(s.success&&s.data&&a){let{info:r,items:i}=s.data,l=(i||[]).reduce((c,u)=>c+(Number(u.thanhTien)||0),0),d=(i||[]).reduce((c,u)=>c+(Number(u.soLuong)||0),0);a.innerHTML=`
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div>\u0110i\u1EC3m b\xE1n: <b class="text-gray-900 dark:text-white truncate block">${I(r.site_name||"\u2014")}</b></div>
          <div>Ng\xE0y \u0111\u1EB7t: <b class="num font-medium text-gray-900 dark:text-white">${ne(r.order_date)}</b></div>
          <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b class="text-gray-900 dark:text-white truncate block">${I(r.ordered_by||"\u2014")}</b></div>
          <div>Tr\u1EA1ng th\xE1i: <b class="text-brand-600 dark:text-brand-400">${I(r.status||"M\u1EDBi t\u1EA1o")}</b></div>
          <div class="col-span-2 pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span>M\u1EB7t h\xE0ng: <b>${i.length} m\xF3n (${Le(d)} SL)</b></span>
            <span class="font-bold text-sm text-brand-600 dark:text-brand-400">${P(l)}</span>
          </div>
        </div>
      `}}catch{}}function yt(){let e=document.getElementById("modalConfirmDeleteOrder");e&&e.classList.add("hidden"),sn=null,window._pendingDeleteOrderCode=null}async function oa(){let e=sn||window._pendingDeleteOrderCode;if(e){if(!ae()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning"),yt();return}typeof showLoading=="function"&&showLoading("\u0110ang x\xF3a \u0111\u01A1n h\xE0ng kh\u1ECFi CSDL...");try{let a=await(await fetch(`/api/order?orderCode=${encodeURIComponent(e)}`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:e})})).json();if(!a.success)throw new Error(a.error||"X\xF3a th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 x\xF3a v\u0129nh vi\u1EC5n \u0111\u01A1n h\xE0ng ${e} th\xE0nh c\xF4ng!`,"success"),yt(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(n){console.error("executeDeleteOrder error:",n),typeof showToast=="function"&&showToast("L\u1ED7i x\xF3a \u0111\u01A1n: "+(n?.message||n),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}}var $=window;$.renderJourneyBadge=gt;$.renderHsOrdersList=mt;$.filterHsOrders=rn;$.loadHistory=Wo;$.viewOrderDetail=Ko;$.canEditOrders=oe;$.canDeleteOrders=ae;$.canAuthenticateJourney=pt;$.STANDARD_STEPS=ht;$.renderJourneyTimeline=ft;$.openOrderJourneyModal=qo;$.closeOrderJourneyModal=zo;$.submitJourneyStep=Qo;$.openEditOrderModal=Jo;$.closeEditOrderModal=dn;$.renderEditOrderItems=Te;$.updateEditOrderItemQty=Yo;$.removeEditOrderItemLine=Zo;$.addEditOrderItemLine=ea;$.recalcEditOrderTotals=ln;$.saveEditOrder=ta;$.confirmDeleteOrder=na;$.closeDeleteOrderModal=yt;$.executeDeleteOrder=oa;function cn(e){return e==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse":e==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800":"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"}function aa(e){return e==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800":e==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800":"bg-gray-50 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300 border-gray-200/70 dark:border-gray-700/60"}function ra(e,n){return e<=0?n<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`${e} ng\xE0y`}function sa(e,n){return e<=0?n<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`C\xF2n ${e} ng\xE0y`}function un(e){return e==="red"?"text-rose-600 dark:text-rose-400":e==="yellow"?"text-amber-600 dark:text-amber-400":"text-emerald-600 dark:text-emerald-400"}function ia(e){return e==="red"?"text-rose-600 dark:text-rose-400":e==="yellow"?"text-amber-600 dark:text-amber-400":"text-gray-900 dark:text-white"}function Fe(e){return e.batch_code||e.batch_no||e.site_code||"KHO"}function Ae(e){return e.unit||e.uom||"Ph\u1EA7n"}function Ee(e){return typeof e=="number"?e:parseFloat(e||"0")||0}function pn(e){let n=Ee(e);return T(n,2)}var j=1,bt=10,xt="fefo_priority",De="asc",R=new Set;function da(){return R}function la(){return j}function ca(e){j=e}function gn(e){let n=document.getElementById("fefoTableBody"),a=document.getElementById("fefoMobileCards");if(!e||!e.length){n&&(n.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),a&&(a.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}n&&(n.innerHTML=e.map(t=>{let o=cn(t.danger_level),s=aa(t.danger_level),r=R.has(t.sku),i=Fe(t),l=Ae(t),d=t.exp_date?t.exp_date.slice(0,10):"\u2014",c=Ee(t.qty),u=t.days_remaining!==void 0?t.days_remaining:t.days_left!==void 0?t.days_left:45,f=ra(u,c),h=un(t.danger_level),g=(t.item_name||"").replace(/'/g,"\\'"),p=t.fefo_priority??1;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3.5 text-center whitespace-nowrap">
            <input type="checkbox" class="stock-row-checkbox rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer" data-sku="${t.sku}" onchange="toggleStockItemSelect('${t.sku}', this.checked)" ${r?"checked":""}>
          </td>
          <td class="p-3.5 text-center whitespace-nowrap">
            <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs mx-auto">${p}</span>
          </td>
          <td class="p-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${t.sku}')" class="text-brand-500 dark:text-brand-400 hover:underline" title="Xem chi ti\u1EBFt k\u1EF9 thu\u1EADt">
              ${t.sku}
            </a>
          </td>
          <td class="p-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[180px]">${t.item_name}</td>
          <td class="p-3.5 whitespace-nowrap">
            <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60">${i}</span>
          </td>
          <td class="p-3.5 whitespace-nowrap min-w-[130px]">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border ${s}">
              <i data-lucide="calendar" class="w-3.5 h-3.5 shrink-0 opacity-70"></i>
              <span>${d}</span>
            </div>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap min-w-[110px]">
            ${pn(c)} <span class="font-sans text-xs font-normal text-gray-500">${l}</span>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold whitespace-nowrap min-w-[95px] ${h}">${f}</td>
          <td class="p-3.5 text-center whitespace-nowrap min-w-[110px]">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${o}">${t.status_text||"An to\xE0n"}</span>
          </td>
          <td class="p-3.5 text-right whitespace-nowrap min-w-[120px]">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${t.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi ti\u1EBFt k\u1EF9 thu\u1EADt">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openEditItemModal('${t.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Ch\u1EC9nh s\u1EEDa \u0111\u1ECBnh m\u1EE9c an to\xE0n">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="openIssueModal('${t.sku}', '${g}', '${i}', ${c})" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all">
                <i data-lucide="package-minus" class="w-3.5 h-3.5"></i> Xu\u1EA5t B\u1EBFp
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=e.map(t=>{let o=cn(t.danger_level),s=Fe(t),r=Ae(t),i=t.exp_date?t.exp_date.slice(0,10):"\u2014",l=Ee(t.qty),d=t.days_remaining!==void 0?t.days_remaining:t.days_left!==void 0?t.days_left:45,c=sa(d,l),u=ia(t.danger_level),f=un(t.danger_level),h=(t.item_name||"").replace(/'/g,"\\'");return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">P${t.fefo_priority??1}</span>
              <span class="font-bold text-xs text-gray-900 dark:text-white truncate">${t.item_name}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 whitespace-nowrap ${o}">${t.status_text||c}</span>
          </div>
          <div class="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-xs">
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">M\xE3 SKU</div>
              <div class="font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap truncate">${t.sku}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">M\xE3 L\xF4 / \u0110i\u1EC3m B\xE1n</div>
              <div class="font-mono font-semibold text-gray-900 dark:text-white whitespace-nowrap truncate">${s}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">H\u1EA1n D\xF9ng (EXP)</div>
              <div class="inline-flex items-center gap-1 font-mono font-bold text-xs whitespace-nowrap ${u}">
                <i data-lucide="calendar" class="w-3 h-3 shrink-0 opacity-70"></i>
                <span>${i}</span>
              </div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">T\xECnh Tr\u1EA1ng H\u1EA1n</div>
              <div class="font-mono font-bold text-xs whitespace-nowrap ${f}">${c}</div>
            </div>
            <div class="col-span-2 flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-gray-800">
              <span class="text-xs text-gray-500 font-medium">T\u1ED3n kh\u1EA3 d\u1EE5ng:</span>
              <span class="font-mono font-bold text-sm whitespace-nowrap ${l<0?"text-rose-600":"text-brand-500 dark:text-brand-400"}">${pn(l)} <span class="font-sans text-xs font-normal text-gray-500">${r}</span></span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1">
            <button onclick="openItemDetailModal('${t.sku}')" class="px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">Chi ti\u1EBFt</button>
            <button onclick="openIssueModal('${t.sku}', '${h}', '${s}', ${l})" class="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"><i data-lucide="package-minus" class="w-3 h-3"></i> Xu\u1EA5t B\u1EBFp</button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function ue(){let e=(document.getElementById("fefoSearchInput")?.value||"").toLowerCase().trim(),n=document.getElementById("fefoCategoryFilter")?.value||"",a=document.getElementById("fefoStatusFilter")?.value||"",o=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(g=>{let p=!e||g.sku&&g.sku.toLowerCase().includes(e)||g.item_name&&g.item_name.toLowerCase().includes(e)||g.batch_code&&g.batch_code.toLowerCase().includes(e)||g.batch_no&&g.batch_no.toLowerCase().includes(e),m=!n||g.category===n||!!g.category&&g.category.includes(n),y=!0;return a==="safe"?y=g.danger_level==="green":a==="yellow"?y=g.danger_level==="yellow":a==="red"?y=g.danger_level==="red":a&&(y=g.danger_level===a),p&&m&&y});o.sort((g,p)=>{let m=g[xt]??"",y=p[xt]??"";return typeof m=="number"&&typeof y=="number"?De==="asc"?m-y:y-m:De==="asc"?String(m).localeCompare(String(y)):String(y).localeCompare(String(m))});let s=o.length,r=Math.ceil(s/bt)||1;j>r&&(j=r),j<1&&(j=1);let i=(j-1)*bt,l=o.slice(i,i+bt),d=document.getElementById("stockPageEnd");d&&(d.textContent=String(Math.min(i+bt,s)));let c=document.getElementById("stockTotalCount");c&&(c.textContent=String(s));let u=document.getElementById("stockCurrentPageBadge");u&&(u.textContent=`${j}/${r}`);let f=document.getElementById("stockPrevBtn");f&&(f.disabled=j<=1);let h=document.getElementById("stockNextBtn");h&&(h.disabled=j>=r),gn(l)}function ua(e){j+=e,ue()}function pa(e){xt===e?De=De==="asc"?"desc":"asc":(xt=e,De="asc"),ue()}function ga(){let e=document.getElementById("fefoSearchInput");e&&(e.value="");let n=document.getElementById("fefoCategoryFilter");n&&(n.value="");let a=document.getElementById("fefoStatusFilter");a&&(a.value=""),j=1,ue()}function ma(e){document.querySelectorAll(".stock-row-checkbox").forEach(a=>{a.checked=e;let t=a.dataset.sku;t&&(e?R.add(t):R.delete(t))}),Re()}function ha(e,n){n?R.add(e):R.delete(e),Re()}function Re(){let e=document.getElementById("stockBulkActionBar"),n=document.getElementById("selectedStockCount");e&&(R.size>0?(e.classList.remove("hidden"),n&&(n.textContent=String(R.size))):e.classList.add("hidden"))}function fa(){R.clear();let e=document.getElementById("selectAllStockCheckbox");e&&(e.checked=!1),document.querySelectorAll(".stock-row-checkbox").forEach(n=>{n.checked=!1}),Re()}var wt=null;async function vt(){try{let e=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",a=await(await fetch(`/api/stock?branch=${encodeURIComponent(e)}`)).json();if(a.success){typeof App<"u"&&(App.fefoItems=a.data||[]);let t=document.getElementById("fefoCategoryFilter"),o=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(t&&o.length){let s=t.value,r=Array.from(new Set(o.map(i=>i.category).filter(Boolean))).sort();t.innerHTML='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>'+r.map(i=>`<option value="${i}">${i}</option>`).join(""),s&&r.includes(s)&&(t.value=s)}ue()}}catch(e){console.error("Error loading FEFO stock:",e)}}function ya(){let e=document.getElementById("modalFastReceipt");e&&e.classList.remove("hidden")}function ba(e,n,a,t){let o=document.getElementById("issueSku");o&&(o.value=e);let s=document.getElementById("issueBatchLabel");s&&(s.innerHTML=`<b>${e}</b> - ${n} <br>L\xF4: <b>${a}</b> (Kh\u1EA3 d\u1EE5ng: ${t})`);let r=document.getElementById("modalFastIssue");r&&r.classList.remove("hidden")}function Pe(e){let n=document.getElementById(e);n&&n.classList.add("hidden")}async function xa(){typeof showLoading=="function"&&showLoading("\u0110ang ghi nh\u1EADn nh\u1EADp kho...");try{let e=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",n=document.getElementById("recSku"),a=document.getElementById("recBatch"),t=document.getElementById("recMfg"),o=document.getElementById("recExp"),s=document.getElementById("recQty"),r=document.getElementById("recLoc"),i={branch_code:e,sku:n?n.value:"",batch_code:a&&a.value?a.value:"BAT-"+Date.now().toString().slice(-4),mfg_date:t?t.value:"",exp_date:o?o.value:"",qty:s?s.value:"0",storage_loc:r?r.value:""},d=await(await fetch("/api/stock/receipt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();d.success?(Pe("modalFastReceipt"),typeof showToast=="function"&&showToast("Nh\u1EADp kho l\xF4 m\u1EDBi th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),vt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+d.error)}catch(e){typeof showToast=="function"&&showToast("L\u1ED7i: "+e.message)}finally{typeof hideLoading=="function"&&hideLoading()}}async function wa(){typeof showLoading=="function"&&showLoading("\u0110ang th\u1EF1c hi\u1EC7n xu\u1EA5t kho FEFO...");try{let e=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",n=document.getElementById("issueSku"),a=document.getElementById("issueQty"),t=document.getElementById("issueNote"),o={branch_code:e,sku:n?n.value:"",qty_needed:a?a.value:"0",note:t?t.value:""},r=await(await fetch("/api/stock/issue",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json();r.success?(Pe("modalFastIssue"),typeof showToast=="function"&&showToast("Xu\u1EA5t kho chu\u1EA9n FEFO th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),vt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+r.error)}catch(e){typeof showToast=="function"&&showToast("L\u1ED7i: "+e.message)}finally{typeof hideLoading=="function"&&hideLoading()}}function va(e){let a=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(l=>l.sku===e);if(!a)return;let t=document.getElementById("editItemSku"),o=document.getElementById("editItemName"),s=document.getElementById("editItemSafetyStock"),r=document.getElementById("editItemUnit");t&&(t.value=a.sku),o&&(o.value=`${a.sku} - ${a.item_name}`),s&&(s.value=String(a.safety_stock||5)),r&&(r.value=a.unit||a.uom||"Can 5L");let i=document.getElementById("modalEditItem");i&&i.classList.remove("hidden")}function ka(){let e=document.getElementById("editItemSku"),n=document.getElementById("editItemSafetyStock"),a=document.getElementById("editItemUnit"),t=e?e.value:"",o=n&&parseFloat(n.value)||5,s=a?a.value:"",i=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(l=>l.sku===t);i&&(i.safety_stock=o,i.unit=s),Pe("modalEditItem"),typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u1ECBnh m\u1EE9c an to\xE0n cho ${t}!`),ue()}async function La(e){try{let n=document.getElementById("modalInventoryDetail");if(!n)return;n.classList.remove("hidden");let a=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",o=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(p=>p.sku===e);if(!o){let m=await(await fetch(`/api/stock?branch=${encodeURIComponent(a)}`)).json();m.success&&m.data&&(o=m.data.find(y=>y.sku===e))}o||(o={sku:e,item_name:e,category:"Gia v\u1ECB",unit:"\u0110\u01A1n v\u1ECB",qty:12,safety_stock:5,standard_cost_sap:185e3,lead_time_hours:24});let s=document.getElementById("detailItemSku");s&&(s.textContent=o.sku);let r=document.getElementById("detailItemName");r&&(r.textContent=o.item_name||o.sku);let i=document.getElementById("detailItemUnit");i&&(i.textContent=o.unit||o.uom||"\u0110\u01A1n v\u1ECB");let l=document.getElementById("detailBadgeCategory");l&&(l.textContent=(o.sku.slice(0,2)||"GV").toUpperCase());let d=document.getElementById("detailQty");d&&(d.textContent=`${o.qty||0} ${o.unit||o.uom||""}`);let c=document.getElementById("detailSafetyStock");c&&(c.textContent=`${o.safety_stock||5} ${o.unit||o.uom||""}`);let u=document.getElementById("detailStandardCost");u&&(u.textContent=E(Number(o.standard_cost_sap)||185e3));let f=document.getElementById("detailLeadTime");f&&(f.textContent=`${o.lead_time_hours||24}h`);let h=document.getElementById("itemDetailStockChart");if(h&&typeof ApexCharts<"u"){wt&&wt.destroy();let p=typeof isDarkModeActive=="function"?isDarkModeActive():!1,y={series:[{name:"T\u1ED3n kho th\u1EF1c t\u1EBF",data:[15,14,16,12,11,14,13,15,14,12,typeof o.qty=="number"?o.qty:parseFloat(String(o.qty))||10]}],colors:["#19723C"],chart:{fontFamily:"'Be Vietnam Pro', sans-serif",type:"area",height:180,toolbar:{show:!1},sparkline:{enabled:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:2.5},fill:{type:"gradient",gradient:{shadeIntensity:1,opacityFrom:.35,opacityTo:.05,stops:[0,95,100]}},xaxis:{categories:["09/11","10/11","11/11","12/11","13/11","14/11","15/11","16/11","17/11","18/11","19/11"],labels:{style:{colors:p?"#94A3B8":"#64748B",fontSize:"10px"}}},yaxis:{labels:{style:{colors:p?"#94A3B8":"#64748B",fontSize:"10px"}}},grid:{borderColor:p?"#1E293B":"#F1F5F9",strokeDashArray:3}};wt=new ApexCharts(h,y),wt.render()}let g=document.getElementById("detailTransactionsBody");g&&(g.innerHTML=`
        <tr>
          <td colspan="5" class="py-6 text-center text-gray-400 dark:text-gray-500 text-xs">
            Ch\u01B0a c\xF3 ph\xE1t sinh giao d\u1ECBch cho m\u1EB7t h\xE0ng n\xE0y.
          </td>
        </tr>
      `),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(n){console.error("Error opening item detail:",n)}}function Ta(e,n,a){let o=[["\u01AFu Ti\xEAn FEFO","M\xE3 SKU","T\xEAn M\u1EB7t H\xE0ng","M\xE3 L\xF4","H\u1EA1n D\xF9ng (EXP)","S\u1ED1 L\u01B0\u1EE3ng T\u1ED3n","\u0110\u01A1n V\u1ECB","S\u1ED1 Ng\xE0y C\xF2n","Tr\u1EA1ng Th\xE1i"]];a.forEach(l=>{let d=l.fefo_priority??1,c=l.sku||"",u=l.item_name||"",f=Fe(l),h=l.exp_date?l.exp_date.slice(0,10):"\u2014",g=Ee(l.qty),p=Ae(l),m=l.days_remaining!==void 0?l.days_remaining:l.days_left!==void 0?l.days_left:45,y=l.status_text||"An to\xE0n";o.push([d,c,u,f,h,g,p,m,y])});let s=XLSX.utils.book_new(),r=XLSX.utils.aoa_to_sheet(o),i=XLSX.utils.decode_range(r["!ref"]);r["!cols"]=[{wch:14},{wch:14},{wch:34},{wch:16},{wch:16},{wch:14},{wch:10},{wch:14},{wch:16}];for(let l=i.s.r;l<=i.e.r;++l)for(let d=i.s.c;d<=i.e.c;++d){let c=XLSX.utils.encode_cell({r:l,c:d});if(r[c])if(l===0)r[c].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let u="left",f;d===0||d===1||d===3||d===4||d===6||d===8?u="center":(d===5||d===7)&&(u="right",d===5&&(f="#,##0.00"),d===7&&(f="#,##0"));let h=d===5&&typeof r[c].v=="number"&&r[c].v<0;r[c].s={font:{name:"Aptos",sz:11,bold:!1,color:{rgb:h?"C00000":"000000"}},alignment:{horizontal:u,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},f&&(r[c].z=f)}}r["!freeze"]={xSplit:0,ySplit:1},r["!autofilter"]={ref:r["!ref"]},XLSX.utils.book_append_sheet(s,r,n),XLSX.writeFile(s,e)}function Ea(){let e=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(!e||!e.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}Ta("Danh_Sach_Ton_Kho_FEFO.xlsx","TonKhoFEFO",e)}function Ca(){if(R.size===0){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t Excel!");return}let n=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(a=>R.has(a.sku));Ta("Ton_Kho_Duoc_Chon.xlsx","DuocChon",n)}if(typeof window<"u"){let e=window;e.renderFefoRows=gn,e.filterFefoLive=ue,e.changeStockPage=ua,e.sortStockBy=pa,e.resetFefoFilters=ga,e.toggleSelectAllStock=ma,e.toggleStockItemSelect=ha,e.updateStockBulkBar=Re,e.clearStockSelection=fa,e.selectedStockSkus=R,e.getSelectedStockSkus=da,e.getStockCurrentPage=la,e.setStockCurrentPage=ca,e.loadStockFEFO=vt,e.openReceiptModal=ya,e.openIssueModal=ba,e.closeModal=Pe,e.submitReceiptToBackend=xa,e.submitIssueToBackend=wa,e.openEditItemModal=va,e.saveItemSpecs=ka,e.openItemDetailModal=La,e.exportFefoToExcel=Ea,e.exportSelectedStockExcel=Ca}function mn(e){let n=document.getElementById("ropTableBody"),a=document.getElementById("ropMobileCards");if(!e||!e.length){n&&(n.innerHTML='<tr><td colspan="9" class="p-8 text-center text-emerald-600 dark:text-emerald-400 font-medium">T\u1EA5t c\u1EA3 m\u1EB7t h\xE0ng t\u1EA1i \u0111i\u1EC3m kho n\xE0y \u0111\u1EC1u \u0111\u1EA1t ng\u01B0\u1EE1ng t\u1ED3n an to\xE0n (Kh\xF4ng c\u1EA7n \u0111\u1EB7t th\xEAm).</td></tr>'),a&&(a.innerHTML='<div class="p-6 text-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">T\u1EA5t c\u1EA3 m\u1EB7t h\xE0ng t\u1EA1i \u0111i\u1EC3m kho n\xE0y \u0111\u1EC1u \u0111\u1EA1t ng\u01B0\u1EE1ng t\u1ED3n an to\xE0n.</div>');return}n&&(n.innerHTML=e.map(t=>{let o=t.sku||"",s=t.item_name||o,r=t.unit||t.uom||"Ph\u1EA7n",i=parseFloat(String(t.daily_usage!==void 0?t.daily_usage:10)),l=t.lead_time_days!==void 0?parseFloat(String(t.lead_time_days)):t.lead_time_hours?Math.round(parseFloat(String(t.lead_time_hours))/24):2,d=parseFloat(String(t.safety_stock!==void 0?t.safety_stock:5)),c=parseFloat(String(t.current_stock!==void 0?t.current_stock:0)),u=parseFloat(String(t.rop!==void 0?t.rop:t.rop_threshold!==void 0?t.rop_threshold:25)),f=parseFloat(String(t.suggested_order!==void 0?t.suggested_order:t.suggested_order_qty!==void 0?t.suggested_order_qty:c<u?Math.max(0,35-c):0)),h=t.status||(c<=0?"H\u1EBET H\xC0NG":c<u?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N"),g="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold";return h==="H\u1EBET H\xC0NG"?g="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold":h==="C\u1EA6N \u0110\u1EB6T"&&(g="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold animate-pulse"),`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 text-center font-mono tabular-nums font-bold text-gray-800 dark:text-gray-200 text-xs">${o}</td>
          <td class="p-3 font-semibold text-gray-900 dark:text-white text-xs">${s}</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${T(i,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${l} ng\xE0y</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${T(d,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${c<=0?"text-rose-600":"text-gray-900 dark:text-white"} text-xs">${T(c,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400 text-xs">${T(u,1)} <span class="text-[11px] text-amber-600/70 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${f>0?"text-brand-600 dark:text-brand-400":"text-gray-400"} text-xs">${f>0?"+"+T(f,1):"0"} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] ${g}">${h}</span>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=e.map(t=>{let o=t.sku||"",s=t.item_name||o,r=t.unit||t.uom||"Ph\u1EA7n",i=t.lead_time_days!==void 0?parseFloat(String(t.lead_time_days)):t.lead_time_hours?Math.round(parseFloat(String(t.lead_time_hours))/24):2,l=parseFloat(String(t.current_stock!==void 0?t.current_stock:0)),d=parseFloat(String(t.rop!==void 0?t.rop:t.rop_threshold!==void 0?t.rop_threshold:25)),c=parseFloat(String(t.suggested_order!==void 0?t.suggested_order:t.suggested_order_qty!==void 0?t.suggested_order_qty:l<d?Math.max(0,35-l):0)),u=t.status||(l<=0?"H\u1EBET H\xC0NG":l<d?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N"),f="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200";return u==="H\u1EBET H\xC0NG"?f="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200":u==="C\u1EA6N \u0110\u1EB6T"&&(f="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200"),`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-xs text-gray-900 dark:text-white">${s}</div>
              <div class="text-[11px] font-mono text-gray-400 mt-0.5">SKU: ${o}</div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${f}">${u}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>T\u1ED3n hi\u1EC7n t\u1EA1i: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${T(l,1)} ${r}</b></div>
            <div>\u0110i\u1EC3m ROP: <b class="font-mono tabular-nums text-amber-600 dark:text-amber-400">${T(d,1)} ${r}</b></div>
            <div>Lead time: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${i} ng\xE0y</b></div>
            <div>\u0110\u1EC1 xu\u1EA5t \u0111\u1EB7t: <b class="font-mono tabular-nums font-semibold text-sm ${c>0?"text-brand-600 dark:text-brand-400":"text-gray-500"}">${c>0?"+"+T(c,1):"0"} ${r}</b></div>
          </div>
        </div>
      `}).join(""))}async function Sa(){let e=localStorage.getItem("orbit_user_site"),n=document.getElementById("globalBranchSelect")?.value,a=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,t=e||n||a||"K001";(t==="ALL"||t==="all")&&(t="K001"),t=t.toUpperCase();let o=document.getElementById("whRopCurrentSiteBadge");if(o){let l=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(d=>d.code&&d.code.toUpperCase()===t.toUpperCase());o.textContent=l?l.ten||l.name:t}let s=document.getElementById("ropTableBody"),r=document.getElementById("ropMobileCards");s&&(s.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400">\u0110ang t\xEDnh to\xE1n ng\u01B0\u1EE1ng an to\xE0n ROP...</td></tr>'),r&&(r.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\xEDnh to\xE1n ng\u01B0\u1EE1ng an to\xE0n ROP...</div>');try{let l=await(await fetch(`/api/reorder?site=${encodeURIComponent(t)}&branch=${encodeURIComponent(t)}&nocache=1`)).json();if(l.success){let d=l.data||[];typeof App<"u"&&(App.ropItems=d),mn(d)}else s&&(s.innerHTML=`<tr><td colspan="9" class="p-8 text-center text-rose-500">L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u: ${l.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</td></tr>`),r&&(r.innerHTML=`<div class="p-6 text-center text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-2xl">L\u1ED7i: ${l.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</div>`)}catch(i){console.error("loadReorderROP error:",i),s&&(s.innerHTML=`<tr><td colspan="9" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${i.message}</td></tr>`)}}function kt(e){let n=document.getElementById("leadTimeTableBody"),a=document.getElementById("leadTimeMobileCards");if(!e||!e.length){n&&(n.innerHTML='<tr><td colspan="7" class="p-8 text-center text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n PO n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 K\u1EF3 th\xE1ng \u0111\xE3 ch\u1ECDn.</td></tr>'),a&&(a.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n PO n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 K\u1EF3 th\xE1ng \u0111\xE3 ch\u1ECDn.</div>');return}n&&(n.innerHTML=e.map(t=>{let o=t.supplier_name||t.vendor_name||"B\u1EBFp Trung T\xE2m Siba Food",s=t.order_date||(t.order_time?t.order_time.split(" ")[0]:"\u2014"),r=t.actual_delivery_date||(t.received_time?t.received_time.split(" ")[0]:"\u2014"),i=t.actual_lead_time_days!==null&&t.actual_lead_time_days!==void 0?t.actual_lead_time_days+" ng\xE0y":t.lead_time_hours?t.lead_time_hours+"h":"\u2014",l=t.status||(t.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N"),d=l==="\u0110\xDANG H\u1EA0N"||t.sla_status==="\u0110\u1EA1t SLA",c=l==="\u0110ANG GIAO"||t.sla_status==="Ch\u1EDD giao",u=d?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200":c?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200":"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 font-mono tabular-nums font-bold text-gray-900 dark:text-white">${t.po_number}</td>
          <td class="p-3 font-mono tabular-nums font-bold text-brand-600 dark:text-brand-400">
            <span class="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60">${t.branch_code||t.site||"\u2014"}</span>
          </td>
          <td class="p-3 font-bold text-gray-800 dark:text-gray-200">${o}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${s}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${r}</td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${!d&&!c?"text-rose-600":"text-emerald-600"}">${i}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${u}">${l}</span>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=e.map(t=>{let o=t.supplier_name||t.vendor_name||"B\u1EBFp Trung T\xE2m Siba Food",s=t.order_date||(t.order_time?t.order_time.split(" ")[0]:"\u2014"),r=t.actual_delivery_date||(t.received_time?t.received_time.split(" ")[0]:"\u2014"),i=t.committed_lead_time_days?t.committed_lead_time_days+" ng\xE0y":t.sla_target_hours?t.sla_target_hours+"h":"24h",l=t.actual_lead_time_days!==null&&t.actual_lead_time_days!==void 0?t.actual_lead_time_days+" ng\xE0y":t.lead_time_hours?t.lead_time_hours+"h":"\u2014",d=t.status||(t.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N"),c=d==="\u0110\xDANG H\u1EA0N"||t.sla_status==="\u0110\u1EA1t SLA",u=d==="\u0110ANG GIAO"||t.sla_status==="Ch\u1EDD giao",f=c?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200":u?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200":"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200";return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-xs text-gray-900 dark:text-white">${o}</div>
              <div class="text-xs font-mono tabular-nums text-gray-400">PO: ${t.po_number} \xB7 \u0110i\u1EC3m: <b class="text-brand-600 dark:text-brand-400">${t.branch_code||t.site||"\u2014"}</b></div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${f}">${d}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${s}</b></div>
            <div>Ng\xE0y nh\u1EADn: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${r}</b></div>
            <div>Cam k\u1EBFt SLA: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${i}</b></div>
            <div>Lead time th\u1EF1c t\u1EBF: <b class="font-mono tabular-nums font-bold ${!c&&!u?"text-rose-600":"text-emerald-600"}">${l}</b></div>
          </div>
        </div>
      `}).join(""))}function hn(e){let n=typeof App<"u"&&App.leadTimeRawData?App.leadTimeRawData:[];if(!e||e==="ALL"){kt(n);return}let a=n.filter(t=>{let o=t.status||(t.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N");return e==="ON_TIME"?o==="\u0110\xDANG H\u1EA0N"||t.sla_status==="\u0110\u1EA1t SLA":e==="DELIVERING"?o==="\u0110ANG GIAO"||t.sla_status==="Ch\u1EDD giao":e==="LATE"?o==="TR\u1EC4 H\u1EA0N"||t.sla_status==="Tr\u1EC5 h\u1EB9n NCC":!0});kt(a)}async function Ia(){let e=document.getElementById("globalBranchSelect")?.value,a=((typeof App<"u"&&App.currentBranch?App.currentBranch:"")||e||"").toUpperCase(),t=document.getElementById("leadTimeMonth")?.value||"",o=new URLSearchParams;a&&a!=="ALL"&&o.set("site",a),t&&o.set("month",t);let s=o.toString()?`/api/leadtime?${o.toString()}`:"/api/leadtime";try{let i=await(await fetch(s)).json(),l=i.success&&i.data?i.data:[];typeof App<"u"&&(App.leadTimeRawData=l);let d=document.getElementById("leadTimeSlaFilter")?.value||"ALL";hn(d)}catch(r){console.error("Error loading Lead Time:",r)}}function Ma(){let e=typeof App<"u"&&App.ropItems?App.ropItems:[];if(!e||!e.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u c\u1EA3nh b\xE1o ROP \u0111\u1EC3 xu\u1EA5t Excel!");return}let a=[["M\xE3 SKU","T\xEAn Gia V\u1ECB / M\u1EB7t H\xE0ng","\u0110VT","Ti\xEAu Th\u1EE5/Ng\xE0y","Lead Time (ng\xE0y)","T\u1ED3n An To\xE0n","T\u1ED3n Hi\u1EC7n T\u1EA1i","Ng\u01B0\u1EE1ng ROP","\u0110\u1EC1 Xu\u1EA5t \u0110\u1EB7t","Tr\u1EA1ng Th\xE1i"]];e.forEach(r=>{let i=r.sku||"",l=r.item_name||i,d=r.unit||r.uom||"Ph\u1EA7n",c=parseFloat(String(r.daily_usage!==void 0?r.daily_usage:10)),u=r.lead_time_days!==void 0?parseFloat(String(r.lead_time_days)):r.lead_time_hours?Math.round(parseFloat(String(r.lead_time_hours))/24):2,f=parseFloat(String(r.safety_stock!==void 0?r.safety_stock:5)),h=parseFloat(String(r.current_stock!==void 0?r.current_stock:0)),g=parseFloat(String(r.rop!==void 0?r.rop:r.rop_threshold!==void 0?r.rop_threshold:25)),p=parseFloat(String(r.suggested_order!==void 0?r.suggested_order:r.suggested_order_qty!==void 0?r.suggested_order_qty:h<g?Math.max(0,35-h):0)),m=r.status||(h<=0?"H\u1EBET H\xC0NG":h<g?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N");a.push([i,l,d,c,u,f,h,g,p,m])});let t=XLSX.utils.book_new(),o=XLSX.utils.aoa_to_sheet(a),s=XLSX.utils.decode_range(o["!ref"]);o["!cols"]=[{wch:14},{wch:34},{wch:10},{wch:14},{wch:16},{wch:14},{wch:14},{wch:14},{wch:14},{wch:16}];for(let r=s.s.r;r<=s.e.r;++r)for(let i=s.s.c;i<=s.e.c;++i){let l=XLSX.utils.encode_cell({r,c:i});if(o[l])if(r===0)o[l].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let d="left",c;i===0||i===2||i===9?d="center":i>=3&&i<=8&&(d="right",c="#,##0.0",(i===4||i===8)&&(c="#,##0"));let u=i===6&&typeof o[l].v=="number"&&o[l].v<=0;o[l].s={font:{name:"Aptos",sz:11,bold:i===6||i===8,color:{rgb:u?"C00000":"000000"}},alignment:{horizontal:d,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},c&&(o[l].z=c)}}o["!freeze"]={xSplit:0,ySplit:1},o["!autofilter"]={ref:o["!ref"]},XLSX.utils.book_append_sheet(t,o,"ROP"),XLSX.writeFile(t,"De_Xuat_Dat_Hang_ROP.xlsx")}if(typeof window<"u"){let e=window;e.loadReorderROP=Sa,e.renderRopTable=mn,e.loadLeadTime=Ia,e.renderLeadTimeTable=kt,e.filterLeadTimeSla=hn,e.downloadRopExcel=Ma}function fn(e){let n=e?"#94A3B8":"#64748B",a=e?"#1E293B":"#F1F5F9";if(typeof chartInboundOutbound<"u"&&chartInboundOutbound)try{chartInboundOutbound.updateOptions({chart:{foreColor:n},grid:{borderColor:a},xaxis:{labels:{style:{colors:n}}},yaxis:{labels:{style:{colors:n}}},tooltip:{theme:e?"dark":"light"}})}catch{}if(typeof chartSafetyGauge<"u"&&chartSafetyGauge)try{chartSafetyGauge.updateOptions({plotOptions:{radialBar:{track:{background:e?"#1C243D":"#E8EAEE"},dataLabels:{value:{color:e?"#FFFFFF":"#1D2939"}}}}})}catch{}if(typeof chartValueTrend<"u"&&chartValueTrend)try{chartValueTrend.updateOptions({chart:{foreColor:n},grid:{borderColor:a},xaxis:{labels:{style:{colors:n}}},yaxis:{labels:{style:{colors:n}}}})}catch{}}function yn(e){let n=document.getElementById("stockAlertsTableBody"),a=document.getElementById("dashStockAlertsMobileCards");if(!n&&!a)return;if(!e||e.length===0){n&&(n.innerHTML=`
        <tr>
          <td colspan="7" class="px-5 py-6 text-center text-gray-400 dark:text-gray-500">
            <i data-lucide="check-circle" class="w-5 h-5 text-emerald-500 inline-block mb-1"></i>
            <p class="font-medium text-xs">Hi\u1EC7n t\u1EA1i kh\xF4ng c\xF3 c\u1EA3nh b\xE1o vi ph\u1EA1m an to\xE0n kho!</p>
          </td>
        </tr>
      `),a&&(a.innerHTML=`
        <div class="card p-6 text-center text-gray-400 dark:text-gray-500">
          <i data-lucide="check-circle" class="w-6 h-6 text-emerald-500 mx-auto mb-2"></i>
          <p class="font-medium text-sm">Hi\u1EC7n t\u1EA1i kh\xF4ng c\xF3 c\u1EA3nh b\xE1o vi ph\u1EA1m an to\xE0n kho!</p>
        </div>
      `),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();return}n&&(n.innerHTML=e.map(o=>{let s="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40",r="B\xECnh th\u01B0\u1EDDng";return o.alert_level==="OUT_OF_STOCK"?(s="bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold",r="H\u1EBFt h\xE0ng"):o.alert_level==="NEAR_EXPIRY"?(s="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 font-bold",r=`C\u1EADn Date (${o.days_left||0}d)`):o.alert_level==="LOW_STOCK"&&(s="bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/40 font-bold",r="D\u01B0\u1EDBi m\u1EE9c an to\xE0n"),`
        <tr class="hover:bg-gray-50/60 dark:hover:bg-white/2 transition-colors">
          <td class="px-5 py-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${o.sku}')" class="text-brand-500 hover:underline flex items-center gap-1">
              ${o.sku}
            </a>
          </td>
          <td class="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[160px]">
            <div>${o.item_name||o.sku}</div>
            <span class="text-xs text-gray-400 font-normal">${o.category||"Gia v\u1ECB"} \u2022 ${o.unit||"\u0110\u01A1n v\u1ECB"}</span>
          </td>
          <td class="px-5 py-3.5 whitespace-nowrap min-w-[155px]">
            <div class="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">${o.batch_code||"L\xF4 kho"}</div>
            <div class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 whitespace-nowrap">
              <i data-lucide="calendar" class="w-3 h-3 shrink-0"></i>
              <span>EXP: ${o.exp_date?o.exp_date.slice(0,10):"Ch\u01B0a c\xF3"}</span>
            </div>
          </td>
          <td class="px-5 py-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            ${o.qty} ${o.unit||""}
          </td>
          <td class="px-5 py-3.5 text-right font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            ${o.safety_stock||5} ${o.unit||""}
          </td>
          <td class="px-5 py-3.5 text-center whitespace-nowrap">
            <span class="inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${s}">
              ${r}
            </span>
          </td>
          <td class="px-5 py-3.5 text-right whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${o.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi ti\u1EBFt">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openReceiptModal('${o.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Nh\u1EADp b\u1ED5 sung">
                <i data-lucide="package-plus" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=e.map(o=>{let s="badge-neutral",r="B\xECnh th\u01B0\u1EDDng";return o.alert_level==="OUT_OF_STOCK"?(s="badge-danger",r="H\u1EBFt h\xE0ng"):o.alert_level==="NEAR_EXPIRY"?(s="badge-warning",r=`C\u1EADn Date (${o.days_left||0}d)`):o.alert_level==="LOW_STOCK"&&(s="badge-warning",r="D\u01B0\u1EDBi m\u1EE9c an to\xE0n"),`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="code font-bold text-brand-600 dark:text-brand-400">${b(o.sku||"")}</span>
              <span class="badge ${s}">${r}</span>
            </div>
            <span class="text-xs text-gray-400">${b(o.batch_code||"L\xF4 kho")}</span>
          </div>
          <div class="data-card-body space-y-1.5">
            <div class="font-semibold text-sm text-gray-900 dark:text-white">${b(o.item_name||o.sku||"")}</div>
            <div class="text-xs text-gray-400">${b(o.category||"Gia v\u1ECB")} \u2022 ${b(o.unit||"\u0110VT")}</div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span class="text-gray-400">T\u1ED3n hi\u1EC7n t\u1EA1i:</span>
                <span class="num font-semibold text-gray-900 dark:text-white ml-1">${o.qty} ${b(o.unit||"")}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400">An to\xE0n:</span>
                <span class="num font-semibold text-amber-600 dark:text-amber-400 ml-1">${o.safety_stock||5} ${b(o.unit||"")}</span>
              </div>
            </div>
            ${o.exp_date?`
              <div class="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 pt-1">
                <span>H\u1EA1n d\xF9ng:</span>
                <span class="num font-medium">${Y(o.exp_date.slice(0,10))}</span>
              </div>
            `:""}
          </div>
          <div class="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="openItemDetailModal('${o.sku}')" class="btn btn-secondary btn-sm">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Chi ti\u1EBFt
            </button>
            <button onclick="openReceiptModal('${o.sku}')" class="btn btn-primary btn-sm">
              <i data-lucide="package-plus" class="w-3.5 h-3.5"></i> Nh\u1EADp b\u1ED5 sung
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();let t=document.documentElement.classList.contains("dark");fn(t)}function bn(e){typeof renderKpi=="function"&&(renderKpi("dashMetricValue",{value:e.total_value||0,sub:"Theo gi\xE1 b\xECnh qu\xE2n kho"}),renderKpi("dashMetricSkus",{value:e.total_skus||0,unit:"M\xE3",isCurrency:!1,sub:"To\xE0n b\u1ED9 danh m\u1EE5c kho"}),renderKpi("dashMetricRop",{value:e.rop_reorder_count||0,unit:"M\xE3",isCurrency:!1,deltaText:(e.rop_reorder_count||0)>0?`${e.rop_reorder_count} m\xE3 c\u1EA7n \u0111\u1EB7t`:"An to\xE0n",deltaGood:(e.rop_reorder_count||0)===0,sub:"Ch\u1EA1m ng\u01B0\u1EE1ng an to\xE0n"}),renderKpi("dashMetricExp",{value:e.critical_exp_count||0,unit:"L\xF4",isCurrency:!1,deltaText:(e.critical_exp_count||0)>0?`${e.critical_exp_count} l\xF4 xu\u1EA5t g\u1EA5p`:"An to\xE0n",deltaGood:(e.critical_exp_count||0)===0,sub:"\u01AFu ti\xEAn xu\u1EA5t FEFO"}),renderKpi("dashMetricSlow",{value:e.slow_moving_count!==void 0?e.slow_moving_count:0,unit:"M\xE3",isCurrency:!1,sub:"L\u01B0u kho kh\xF4ng bi\u1EBFn \u0111\u1ED9ng"}));let n=document.getElementById("dashLeadTimeText");if(n&&(n.textContent=`${e.avg_lead_time||24.5}h`),typeof chartSafetyGauge<"u"&&chartSafetyGauge&&typeof e.safety_rate<"u")try{chartSafetyGauge.updateSeries([parseFloat(String(e.safety_rate))])}catch{}if(typeof chartInboundOutbound<"u"&&chartInboundOutbound&&e.chart_inbound_outbound){let a=e.chart_inbound_outbound,t=Array.isArray(a.categories)?a.categories:String(a.categories||"").split(" ").filter(Boolean),o=Array.isArray(a.inbound)?a.inbound:String(a.inbound||"").split(" ").filter(Boolean).map(Number),s=Array.isArray(a.outbound)?a.outbound:String(a.outbound||"").split(" ").filter(Boolean).map(Number);if(t.length)try{chartInboundOutbound.updateOptions({xaxis:{categories:t}}),chartInboundOutbound.updateSeries([{name:"Nh\u1EADp kho (Tr \u20AB)",data:o},{name:"Xu\u1EA5t kho (Tr \u20AB)",data:s}])}catch(r){console.warn("Chart update notice:",r)}}yn(e.alerts||[])}async function _a(){try{let e=(typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL").toUpperCase(),n=document.getElementById("dashBranchTitle");n&&(n.textContent=e&&e!=="ALL"?e:"To\xE0n Chu\u1ED7i");let t=await(await fetch(`/api/dashboard-summary?branch=${encodeURIComponent(e)}&refresh=true`)).json();if(t.success){let o=t.data;bn(o);let s=document.getElementById("dashCritCount");s&&(s.textContent=String(o.critical_exp_count||0));let r=document.getElementById("dashRopCount");r&&(r.textContent=String(o.rop_reorder_count||0));let i=document.getElementById("dashLeadTime");i&&(i.textContent=`${o.avg_lead_time||24.5}h`);let l=document.getElementById("dashTotalQty");l&&(l.textContent=T(o.total_qty||0,1));let d=document.getElementById("dashTotalSkus");d&&(d.textContent=`${o.total_skus||0} SKU \u0111ang qu\u1EA3n l\xFD`);let c=document.getElementById("badgeCritNav");c&&(c.textContent=String(o.critical_exp_count||0));let u=document.getElementById("badgeRopNav");u&&(u.textContent=String(o.rop_reorder_count||0))}}catch(e){console.error("Error loading dashboard summary:",e)}}if(typeof window<"u"){let e=window;e.loadDashboardSummary=_a,e.updateTailadminDashboard=bn,e.renderStockAlertsTable=yn,e.updateApexChartsTheme=fn}var V=[],pe=[];function Td(){return V}function Ed(){return pe}function xn(){let e=(document.getElementById("whInvSearchInput")?.value||"").toLowerCase().trim(),n=document.getElementById("whInvCategorySelect")?.value||"",a=document.getElementById("whInvStatusSelect")?.value||"ALL",t=[...V];e&&(t=t.filter(m=>m.sku&&m.sku.toLowerCase().includes(e)||m.name&&m.name.toLowerCase().includes(e))),n&&(t=t.filter(m=>m.category===n)),a==="HAS_RECEIPT"?t=t.filter(m=>parseFloat(String(m.receipt_qty||0))>0):a==="IN_STOCK"?t=t.filter(m=>parseFloat(String(m.book_qty||0))>0):a==="HAS_BATCH"?t=t.filter(m=>parseInt(String(m.batch_count||0),10)>0):a==="NEGATIVE"&&(t=t.filter(m=>parseFloat(String(m.book_qty||0))<0)),pe=t,typeof window<"u"&&(window.gWhFilteredInventory=t);let o=0,s=0,r=0,i=0;t.forEach(m=>{o+=parseFloat(String(m.receipt_qty||0)),s+=parseFloat(String(m.book_qty||0)),r+=parseFloat(String(m.total_value||0)),i+=parseInt(String(m.batch_count||0),10)});let l=document.getElementById("whKpiTotalSkus");l&&(l.textContent=T(t.length,0));let d=document.getElementById("whKpiTotalReceiptQty");d&&(d.textContent=T(Math.round(o*10)/10,1));let c=document.getElementById("whKpiTotalBookQty");c&&(c.textContent=T(Math.round(s*10)/10,1));let u=document.getElementById("whKpiTotalValue");u&&(u.textContent=E(r));let f=document.getElementById("whKpiTotalBatches");f&&(f.textContent=T(i,0));let h=document.getElementById("whInvRowCount");h&&(h.textContent=T(t.length,0));let g=document.getElementById("whInventoryTableBody"),p=document.getElementById("whInventoryMobileCards");if(!t.length){g&&(g.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>'),p&&(p.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</div>');return}g&&(g.innerHTML=t.map((m,y)=>{let x=parseFloat(String(m.receipt_qty||0)),w=parseFloat(String(m.book_qty||0)),v=parseInt(String(m.batch_count||0),10),L="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";return w<0?L="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/80":w>0&&(L="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80"),`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="px-2 py-2 text-center text-gray-400 tabular-nums font-mono">${y+1}</td>
          <td class="px-2 py-2 whitespace-nowrap">
            <button onclick="openWhItemHistoryModal('${m.sku}')" class="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1" title="Xem th\u1EBB kho chi ti\u1EBFt">
              <span>${m.sku}</span>
              <i data-lucide="external-link" class="w-3 h-3 opacity-60"></i>
            </button>
          </td>
          <td class="px-2 py-2 font-semibold text-gray-900 dark:text-white min-w-[150px]">
            <div class="line-clamp-2">${m.name||m.sku}</div>
          </td>
          <td class="px-2 py-2 whitespace-nowrap text-center">
            <span class="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium border border-gray-200/60 dark:border-gray-700/60 inline-block max-w-[110px] truncate" title="${m.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}">${m.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}</span>
          </td>
          <td class="px-1.5 py-2 text-center whitespace-nowrap font-medium text-gray-600 dark:text-gray-300">${m.unit||"Ph\u1EA7n"}</td>
          <td class="px-2 py-2 text-right whitespace-nowrap bg-emerald-50/30 dark:bg-emerald-950/10">
            <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs px-1.5 py-0.5 rounded-md bg-emerald-100/60 dark:bg-emerald-900/30 tabular-nums">
              ${T(x,1)}
            </span>
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap bg-blue-50/30 dark:bg-blue-950/10">
            <span class="font-mono font-bold text-xs px-1.5 py-0.5 rounded-md tabular-nums ${L}">
              ${T(w,1)}
            </span>
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
            ${E(Number(m.unit_price)||0)}
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
            ${E(Number(m.total_value)||0)}
          </td>
          <td class="px-1.5 py-2 text-center whitespace-nowrap">
            <button onclick="openWhItemBatchesModal('${m.sku}')" class="px-1.5 py-0.5 rounded-lg text-xs font-semibold font-mono transition-all ${v>0?"bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-200 border border-purple-200/80 dark:border-purple-800/80":"bg-gray-100 text-gray-400 dark:bg-gray-800 hover:text-gray-600"}" title="Xem chi ti\u1EBFt c\xE1c l\xF4 h\xE0ng">
              ${v>0?v+" L\xF4":"0 L\xF4"}
            </button>
          </td>
          <td class="px-2 py-2 text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1 justify-center">
              <button onclick="openWhItemHistoryModal('${m.sku}')" class="px-1.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-0.5 transition-all" title="Xem th\u1EBB kho l\u1ECBch s\u1EED xu\u1EA5t nh\u1EADp">
                <i data-lucide="history" class="w-3 h-3"></i> Th\u1EBB Kho
              </button>
              <button onclick="openWhItemBatchesModal('${m.sku}')" class="px-1.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold rounded-lg border border-purple-200 dark:border-purple-800/60 flex items-center gap-0.5 transition-all" title="Xem chi ti\u1EBFt c\xE1c l\xF4 \u0111\xE3 nh\u1EADp">
                <i data-lucide="layers" class="w-3 h-3"></i> L\xF4
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),p&&(p.innerHTML=t.map((m,y)=>{let x=parseFloat(String(m.receipt_qty||0)),w=parseFloat(String(m.book_qty||0)),v=parseInt(String(m.batch_count||0),10);return`
        <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-xs font-mono">#${y+1}</span>
                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${m.sku}</span>
                <span class="px-1.5 py-0.2 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">${m.unit||"Ph\u1EA7n"}</span>
              </div>
              <h4 class="font-bold text-xs text-gray-900 dark:text-white mt-1 leading-snug">${m.name||m.sku}</h4>
              <div class="text-xs text-gray-500 mt-0.5">${m.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}</div>
            </div>
            <button onclick="openWhItemBatchesModal('${m.sku}')" class="px-2 py-1 rounded-lg text-xs font-bold font-mono ${v>0?"bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300":"bg-gray-100 text-gray-400 dark:bg-gray-800"}">
              ${v>0?v+" L\xF4":"0 L\xF4"}
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 text-xs border border-gray-100 dark:border-gray-800">
            <div>
              <span class="text-xs text-emerald-700 dark:text-emerald-400 block font-semibold">\u0110\xE3 Nh\u1EADp Kho</span>
              <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">${T(x,1)}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">T\u1ED3n S\u1ED5 S\xE1ch</span>
              <span class="font-mono font-bold tabular-nums ${w<0?"text-rose-600":"text-gray-900 dark:text-white"}">${T(w,1)}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Gi\xE1 Tr\u1ECB T\u1ED3n</span>
              <span class="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums text-xs">${E(Number(m.total_value)||0)}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <button onclick="openWhItemHistoryModal('${m.sku}')" class="w-full py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="history" class="w-3.5 h-3.5"></i> Th\u1EBB Kho Xu\u1EA5t Nh\u1EADp
            </button>
            <button onclick="openWhItemBatchesModal('${m.sku}')" class="w-full py-2 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold rounded-xl border border-purple-200 dark:border-purple-800/60 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="layers" class="w-3.5 h-3.5"></i> Chi Ti\u1EBFt L\xF4 H\xE0ng
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}async function wn(){let e=document.getElementById("whInvSiteSelect"),n=localStorage.getItem("orbit_user_site"),a=document.getElementById("globalBranchSelect")?.value,t=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,o=n||a||t||(e?e.value:null)||"K001";if((o==="ALL"||o==="all")&&(o="K001"),o=o.toUpperCase(),e){if(!e.options||e.options.length<=1){let d=typeof window.getAppSitesList=="function"?window.getAppSitesList():[];e.innerHTML=d.map(c=>`<option value="${c.code}">${c.ten||c.name}</option>`).join("")}e.value=o}let s=document.getElementById("whInvCurrentSiteBadge");if(s){let c=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(u=>u.code&&u.code.toUpperCase()===o.toUpperCase());s.textContent=c?c.ten||c.name:o}let r=o,i=document.getElementById("whInventoryTableBody"),l=document.getElementById("whInventoryMobileCards");i&&(i.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u t\u1ED3n kho WMS...</td></tr>'),l&&(l.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u t\u1ED3n kho WMS...</div>');try{let c=await(await fetch(`/api/wh/inventory?site=${encodeURIComponent(r)}&nocache=1`)).json();if(c.success){V=c.data||[],typeof window<"u"&&(window.gWhInventoryData=V);let u=document.getElementById("whInvCategorySelect");if(u){let f=u.value,h=Array.from(new Set(V.map(g=>g.category).filter(Boolean))).sort();u.innerHTML='<option value="">T\u1EA5t c\u1EA3 nh\xF3m ng\xE0nh</option>'+h.map(g=>`<option value="${g}">${g}</option>`).join(""),f&&h.includes(f)&&(u.value=f)}xn()}else i&&(i.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500">L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u: ${c.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</td></tr>`)}catch(d){console.error("loadWhInventory error:",d),i&&(i.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${d.message}</td></tr>`)}}var re=null,Oe=null;function Md(){return re}function _d(){return Oe}async function $a(e){let n=(V||[]).find(u=>u.sku===e)||{sku:e,name:e,unit:"Ph\u1EA7n"},a=document.getElementById("whInvSiteSelect"),t=a?a.value:"ALL",o=document.getElementById("histItemSku");o&&(o.textContent=n.sku);let s=document.getElementById("histItemName");s&&(s.textContent=n.name||n.sku);let r=document.getElementById("histItemUnit");r&&(r.textContent=n.unit||"Ph\u1EA7n");let i=document.getElementById("histItemSite");i&&(i.textContent=t==="ALL"?"To\xE0n H\u1EC7 Th\u1ED1ng":t);let l=document.getElementById("modalWhItemHistory");l&&l.classList.remove("hidden");let d=document.getElementById("whHistTableBody"),c=document.getElementById("whHistMobileCards");d&&(d.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">\u0110ang truy xu\u1EA5t th\u1EBB kho t\u1EEB h\u1EC7 th\u1ED1ng...</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">\u0110ang truy xu\u1EA5t th\u1EBB kho...</div>');try{let f=await(await fetch(`/api/wh/item-history?sku=${encodeURIComponent(e)}&site=${encodeURIComponent(t)}&nocache=1`)).json();if(f.success){re=f.data,typeof window<"u"&&(window.gWhActiveHistory=re);let h=f.data.history||[],g=document.getElementById("histTotalIn");g&&(g.textContent=T(f.data.total_in||0,1));let p=document.getElementById("histTotalOut");p&&(p.textContent=T(f.data.total_out||0,1));let m=document.getElementById("histRowCount");if(m&&(m.textContent=T(h.length,0)),!h.length){d&&(d.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Ch\u01B0a ghi nh\u1EADn giao d\u1ECBch xu\u1EA5t nh\u1EADp n\xE0o cho m\xE3 h\xE0ng n\xE0y t\u1EA1i \u0111i\u1EC3m \u0111\xE3 ch\u1ECDn.</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Ch\u01B0a ghi nh\u1EADn giao d\u1ECBch xu\u1EA5t nh\u1EADp n\xE0o.</div>');return}d&&(d.innerHTML=h.map(y=>{let x=parseFloat(String(y.qty_in||0)),w=parseFloat(String(y.qty_out||0)),v="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";return y.trans_type==="NHAP_KHO"?v="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200":y.trans_type==="XUAT_HUY"?v="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200":y.trans_type==="DIEU_CHUYEN"?v="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200":y.trans_type==="XUAT_KHO"&&(v="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"),`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="p-2.5 text-center whitespace-nowrap font-mono tabular-nums text-gray-600 dark:text-gray-300">${y.doc_date?String(y.doc_date).split("T")[0]:"\u2014"}</td>
              <td class="p-2.5 whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white">${y.doc_no||"\u2014"}</td>
              <td class="p-2.5 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${v}">${y.trans_name||y.trans_type}</span>
              </td>
              <td class="p-2.5 whitespace-nowrap font-mono text-xs text-gray-600 dark:text-gray-300">
                ${y.batch_code?`<b class="text-purple-600 dark:text-purple-400">${y.batch_code}</b>`:"\u2014"}
                ${y.exp_date?`<span class="text-gray-400 block text-xs">HSD: ${String(y.exp_date).split("T")[0]}</span>`:""}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${x>0?`+${T(x,1)}`:"\u2014"}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                ${w>0?`-${T(w,1)}`:"\u2014"}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
                ${E(Number(y.unit_price)||0)}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
                ${E(Number(y.amount)||0)}
              </td>
              <td class="p-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300 max-w-[150px] truncate" title="${y.partner_name||""}">
                ${y.partner_name||"\u2014"}
              </td>
              <td class="p-2.5 text-gray-500 dark:text-gray-400 max-w-[200px] truncate" title="${y.notes||""}">
                ${y.notes||"\u2014"}
              </td>
            </tr>
          `}).join("")),c&&(c.innerHTML=h.map(y=>{let x=parseFloat(String(y.qty_in||0)),w=parseFloat(String(y.qty_out||0)),v=y.doc_date?String(y.doc_date).split("T")[0]:"\u2014";return`
            <div class="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <div class="font-mono font-bold text-gray-900 dark:text-white">${y.doc_no||"\u2014"}</div>
                <span class="text-xs text-gray-400 font-mono">${v}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-gray-300">${y.trans_name||y.trans_type}</span>
                <span class="font-mono font-bold ${x>0?"text-emerald-600":"text-rose-600"}">
                  ${x>0?`+${T(x,1)}`:`-${T(w,1)}`} ${n.unit||""}
                </span>
              </div>
              ${y.batch_code?`<div class="text-xs text-purple-600 dark:text-purple-400 font-mono">L\xF4: <b>${y.batch_code}</b> ${y.exp_date?"\u2022 HSD: "+String(y.exp_date).split("T")[0]:""}</div>`:""}
              ${y.partner_name?`<div class="text-xs text-gray-500">\u0110\u1ED1i t\xE1c: ${y.partner_name}</div>`:""}
              ${y.notes?`<div class="text-xs text-gray-400 italic">${y.notes}</div>`:""}
            </div>
          `}).join(""))}else d&&(d.innerHTML=`<tr><td colspan="10" class="p-8 text-center text-rose-500">L\u1ED7i: ${f.error}</td></tr>`)}catch(u){console.error("openWhItemHistoryModal error:",u),d&&(d.innerHTML=`<tr><td colspan="10" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${u.message}</td></tr>`)}}async function Ba(e){let n=(V||[]).find(u=>u.sku===e)||{sku:e,name:e,unit:"Ph\u1EA7n"},a=document.getElementById("whInvSiteSelect"),t=a?a.value:"ALL",o=document.getElementById("batchItemSku");o&&(o.textContent=n.sku);let s=document.getElementById("batchItemName");s&&(s.textContent=n.name||n.sku);let r=document.getElementById("batchItemUnit");r&&(r.textContent=n.unit||"Ph\u1EA7n");let i=document.getElementById("batchItemSite");i&&(i.textContent=t==="ALL"?"To\xE0n H\u1EC7 Th\u1ED1ng":t);let l=document.getElementById("modalWhItemBatches");l&&l.classList.remove("hidden");let d=document.getElementById("whBatchesTableBody"),c=document.getElementById("whBatchesMobileCards");d&&(d.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400">\u0110ang truy v\u1EA5n danh s\xE1ch l\xF4 date FEFO...</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">\u0110ang truy v\u1EA5n l\xF4 date...</div>');try{let f=await(await fetch(`/api/wh/item-batches?sku=${encodeURIComponent(e)}&site=${encodeURIComponent(t)}&nocache=1`)).json();if(f.success){Oe=f.data,typeof window<"u"&&(window.gWhActiveBatches=Oe);let h=f.data.batches||[],g=0,p=0;h.forEach(w=>{w.status==="GOOD"?g++:p++});let m=document.getElementById("batchTotalCount");m&&(m.textContent=T(h.length,0));let y=document.getElementById("batchSafeCount");y&&(y.textContent=T(g,0));let x=document.getElementById("batchWarnCount");if(x&&(x.textContent=T(p,0)),!h.length){d&&(d.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400">Ch\u01B0a c\xF3 l\xF4 h\xE0ng date ri\xEAng bi\u1EC7t n\xE0o \u0111\u01B0\u1EE3c ghi nh\u1EADn cho m\xE3 n\xE0y (\u0111ang qu\u1EA3n l\xFD t\u1ED3n g\u1ED9p theo site).</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Ch\u01B0a c\xF3 l\xF4 h\xE0ng date ri\xEAng bi\u1EC7t.</div>');return}d&&(d.innerHTML=h.map(w=>{let v="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200",L="C\xF2n h\u1EA1n an to\xE0n";w.status==="EXPIRED"?(v="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200",L="\u0110\xE3 h\u1EBFt h\u1EA1n"):w.status==="NEAR_EXPIRY"&&(v="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200",L="C\u1EADn date (\u2264 30 ng\xE0y)");let C=w.exp_date?String(w.exp_date).split("T")[0]:"\u2014",M=w.days_left!==999?`${w.days_left} ng\xE0y`:"\u2014";return`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="p-2.5 whitespace-nowrap font-mono font-bold text-purple-700 dark:text-purple-400">${w.batch_code||"L\xD4-CHUNG"}</td>
              <td class="p-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300">
                <span>${w.site_code||""}</span> \u2022 <span class="text-gray-400">${w.storage_loc||"K\u1EC7 B\u1EBFp"}</span>
              </td>
              <td class="p-2.5 text-center whitespace-nowrap font-mono font-semibold text-gray-800 dark:text-gray-200 tabular-nums">${C}</td>
              <td class="p-2.5 text-center whitespace-nowrap font-mono tabular-nums font-semibold ${w.status==="EXPIRED"?"text-rose-600":w.status==="NEAR_EXPIRY"?"text-amber-600":"text-emerald-600"}">
                ${M}
              </td>
              <td class="p-2.5 text-center whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${v}">${L}</span>
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
                ${T(Number(w.initial_qty)||0,1)}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                ${T(Number(w.current_qty)||0,1)}
              </td>
              <td class="p-2.5 whitespace-nowrap font-mono text-gray-500 text-xs">
                ${w.receipt_code?`<span class="text-brand-600 font-semibold">${w.receipt_code}</span>`:"\u2014"}
              </td>
            </tr>
          `}).join("")),c&&(c.innerHTML=h.map(w=>{let v=w.exp_date?String(w.exp_date).split("T")[0]:"\u2014";return`
            <div class="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-purple-700 dark:text-purple-400">L\xF4: ${w.batch_code||"L\xD4-CHUNG"}</span>
                <span class="font-mono font-semibold text-xs ${w.status==="EXPIRED"?"text-rose-600":w.status==="NEAR_EXPIRY"?"text-amber-600":"text-emerald-600"}">
                  ${w.days_left!==999?`C\xF2n ${w.days_left} ng\xE0y`:""}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>H\u1EA1n d\xF9ng: <b class="font-mono text-gray-900 dark:text-white">${v}</b></div>
                <div>V\u1ECB tr\xED: <b class="text-gray-900 dark:text-white">${w.storage_loc||"K\u1EC7 B\u1EBFp"}</b></div>
                <div>SL Nh\u1EADp: <b class="font-mono text-gray-900 dark:text-white">${T(Number(w.initial_qty)||0,1)}</b></div>
                <div>SL T\u1ED3n: <b class="font-mono font-bold text-blue-600 dark:text-blue-400">${T(Number(w.current_qty)||0,1)}</b></div>
              </div>
              ${w.receipt_code?`<div class="text-xs text-gray-400">Ch\u1EE9ng t\u1EEB: ${w.receipt_code}</div>`:""}
            </div>
          `}).join(""))}else d&&(d.innerHTML=`<tr><td colspan="8" class="p-8 text-center text-rose-500">L\u1ED7i: ${f.error}</td></tr>`)}catch(u){console.error("openWhItemBatchesModal error:",u),d&&(d.innerHTML=`<tr><td colspan="8" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${u.message}</td></tr>`)}}var se=[],ie=null;function Hd(){return se}function Ha(e){let n=document.getElementById("whInvTabBtnBalance"),a=document.getElementById("whInvTabBtnReceipts"),t=document.getElementById("whInvBalanceView"),o=document.getElementById("whInvReceiptsView");e==="balance"?(n&&(n.className="btn btn-primary btn-sm"),a&&(a.className="btn btn-secondary btn-sm"),t&&t.classList.remove("hidden"),o&&o.classList.add("hidden")):(n&&(n.className="btn btn-secondary btn-sm"),a&&(a.className="btn btn-primary btn-sm"),t&&t.classList.add("hidden"),o&&o.classList.remove("hidden"),Tt()),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function vn(){let e=document.getElementById("whReceivedOrdersSiteFilter");if(!e||e.options&&e.options.length>1)return;let n=typeof window.getAppSitesList=="function"?window.getAppSitesList():[];e.innerHTML=n.map(t=>`<option value="${t.code}">${t.ten||t.name}</option>`).join("");let a=localStorage.getItem("orbit_user_site")||(typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():"K001");a&&(e.value=a.toUpperCase())}function Lt(){let e=document.getElementById("whReceivedOrdersTableBody"),n=document.getElementById("whReceivedOrdersMobileCards"),a=(document.getElementById("whReceivedOrdersSearchInput")?.value||"").trim().toLowerCase(),t=document.getElementById("whReceivedOrdersTypeFilter")?.value||"ALL",o=[...se];t!=="ALL"&&(o=o.filter(u=>u.doc_type===t)),a&&(o=o.filter(u=>(u.po_number||"").toLowerCase().includes(a)||(u.receipt_code||"").toLowerCase().includes(a)||(u.supplier||"").toLowerCase().includes(a)||(u.site_code||"").toLowerCase().includes(a)||(u.notes||"").toLowerCase().includes(a)||(u.created_by||"").toLowerCase().includes(a)));let s=document.getElementById("whKpiReceivedOrdersCount"),r=document.getElementById("whKpiReceivedOrdersTotalQty"),i=document.getElementById("whKpiReceivedOrdersTotalAmount"),l=document.getElementById("whReceivedOrdersCountText"),d=0,c=0;if(o.forEach(u=>{d+=Number(u.total_qty)||0,c+=Number(u.total_amount)||0}),s&&(s.textContent=String(o.length)),r&&(r.textContent=T(d,1)),i&&(i.textContent=Math.round(c).toLocaleString("vi-VN")+" \u20AB"),l&&(l.textContent=String(o.length)),!o.length){e&&(e.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),n&&(n.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}e&&(e.innerHTML=o.map((u,f)=>{let g=u.doc_type==="DIRECT"?'<span class="badge badge-neutral text-xs">Tr\u1EF1c ti\u1EBFp</span>':u.doc_type==="PR"?'<span class="badge badge-brand text-xs">\u0110\u01A1n PR</span>':'<span class="badge badge-brand text-xs">\u0110\u01A1n PO</span>',p=Y(u.receipt_date),m=Math.round(Number(u.total_amount)||0).toLocaleString("vi-VN")+" \u20AB";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="w-10 text-center text-gray-400 num font-mono text-xs">${f+1}</td>
          <td class="col-code font-bold">
            <span class="code font-bold text-brand-600 dark:text-brand-400">${b(u.po_number||"\u2014")}</span>
            <div class="mt-0.5">${g}</div>
          </td>
          <td class="col-code">
            <span class="code text-gray-800 dark:text-gray-200">${b(u.receipt_code||"\u2014")}</span>
          </td>
          <td class="text-center font-semibold text-xs text-gray-700 dark:text-gray-300">
            <span class="badge badge-neutral">${b(u.site_code||"K001")}</span>
          </td>
          <td class="col-date num whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">${p}</td>
          <td>
            <div class="font-medium text-xs text-gray-900 dark:text-white">${b(u.supplier||"N/A")}</div>
            ${u.notes?`<div class="text-xs text-gray-400 truncate max-w-[200px]" title="${b(u.notes)}">${b(u.notes)}</div>`:""}
          </td>
          <td class="col-num text-center num text-xs font-semibold">${u.item_count||1} m\xF3n</td>
          <td class="col-num text-right font-bold text-gray-900 dark:text-white num text-xs">${m}</td>
          <td class="text-xs text-gray-500 dark:text-gray-400">${b(u.created_by||"Th\u1EE7 kho")}</td>
          <td class="col-badge text-center">
            <span class="badge badge-brand text-xs whitespace-nowrap">\u0110\xE3 nh\u1EADp kho</span>
          </td>
          <td class="col-actions text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5 justify-center">
              <button onclick="openWhReceivedOrderDetail('${u.id||""}', '${b(u.po_number||"")}')" class="btn btn-secondary btn-sm" title="Xem chi ti\u1EBFt d\xF2ng h\xE0ng">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Chi ti\u1EBFt
              </button>
              <button onclick="confirmCancelReceivedOrder('${u.id||""}', '${b(u.po_number||"")}', '${b(u.receipt_code||"")}', ${Number(u.total_amount)||0})" class="btn btn-danger btn-sm" title="H\u1EE7y nh\u1EADp kho v\xE0 ho\xE0n t\xE1c t\u1ED3n kho">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> H\u1EE7y nh\u1EADp
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=o.map(u=>{let h=u.doc_type==="DIRECT"?'<span class="badge badge-neutral text-xs">Tr\u1EF1c ti\u1EBFp</span>':u.doc_type==="PR"?'<span class="badge badge-brand text-xs">\u0110\u01A1n PR</span>':'<span class="badge badge-brand text-xs">\u0110\u01A1n PO</span>',g=Y(u.receipt_date),p=Math.round(Number(u.total_amount)||0).toLocaleString("vi-VN")+" \u20AB";return`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="code font-bold text-brand-600 dark:text-brand-400">${b(u.po_number||u.receipt_code||"")}</span>
              ${h}
            </div>
            <span class="badge badge-brand text-xs">\u0110\xE3 nh\u1EADp kho</span>
          </div>

          <div class="data-card-body space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">Phi\u1EBFu nh\u1EADp:</span>
              <span class="code text-gray-700 dark:text-gray-300 font-semibold">${b(u.receipt_code||"\u2014")}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">Nh\xE0 cung c\u1EA5p:</span>
              <span class="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">${b(u.supplier||"N/A")}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">\u0110i\u1EC3m nh\u1EADn / Ng\xE0y:</span>
              <span class="text-gray-600 dark:text-gray-300 font-medium">${b(u.site_code||"")} \u2022 <span class="num">${g}</span></span>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-gray-400 block">S\u1ED1 m\u1EB7t h\xE0ng</span>
                <span class="num font-bold text-gray-900 dark:text-white">${u.item_count||1} m\xF3n (${T(u.total_qty||0,1)})</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400 block">T\u1ED5ng ti\u1EC1n nh\u1EADp</span>
                <span class="num font-bold text-brand-600 dark:text-brand-400 text-sm">${p}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="openWhReceivedOrderDetail('${u.id||""}', '${b(u.po_number||"")}')" class="btn btn-secondary btn-sm w-full">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Xem chi ti\u1EBFt
            </button>
            <button onclick="confirmCancelReceivedOrder('${u.id||""}', '${b(u.po_number||"")}', '${b(u.receipt_code||"")}', ${Number(u.total_amount)||0})" class="btn btn-danger btn-sm w-full">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> H\u1EE7y nh\u1EADp kho
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Na(){Lt()}async function Tt(){vn();let e=document.getElementById("whReceivedOrdersSiteFilter"),n=localStorage.getItem("orbit_user_site"),a=document.getElementById("globalBranchSelect")?.value,t=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,o=n||a||t||(e?e.value:null)||"K001";(o==="ALL"||o==="all")&&(o="K001"),o=o.toUpperCase(),e&&(e.value=o);let s=o,r=document.getElementById("whReceivedOrdersTableBody"),i=document.getElementById("whReceivedOrdersMobileCards");r&&(r.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">\u0110ang t\u1EA3i danh s\xE1ch \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho...</td></tr>'),i&&(i.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\u1EA3i danh s\xE1ch \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho...</div>');try{let d=await(await fetch(`/api/wh/received-orders?site=${encodeURIComponent(s)}&no-cache=1`)).json();d.success&&d.data?se=d.data.orders||[]:se=[],typeof window<"u"&&(window.gWhReceivedOrders=se);let c=document.getElementById("whInvBadgeReceiptsCount");c&&(c.textContent=String(se.length)),Lt()}catch(l){console.error("loadWhReceivedOrders error:",l),r&&(r.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i danh s\xE1ch: ${l.message}</td></tr>`),i&&(i.innerHTML=`<div class="p-6 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i danh s\xE1ch: ${l.message}</div>`)}}async function Fa(e,n){let a=document.getElementById("whReceivedOrderDetailModal");if(!a)return;a.classList.remove("hidden");let t=document.getElementById("whRecModalTitle"),o=document.getElementById("whRecModalPoNumber"),s=document.getElementById("whRecModalReceiptCode"),r=document.getElementById("whRecModalSite"),i=document.getElementById("whRecModalDate"),l=document.getElementById("whRecModalSupplier"),d=document.getElementById("whRecModalCreatedBy"),c=document.getElementById("whRecModalTotalAmount"),u=document.getElementById("whRecModalLinesBody");t&&(t.textContent=`Chi ti\u1EBFt \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho: ${n||e}`),o&&(o.textContent=n||"\u2014"),u&&(u.innerHTML='<tr><td colspan="9" class="p-6 text-center text-gray-400">\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng \u0111\xE3 nh\u1EADp...</td></tr>'),ie={receiptId:e,poNumber:n},typeof window<"u"&&(window.gWhCurrentReceivedDetail=ie);try{let f=(se||[]).find(g=>e&&String(g.id)===String(e)||n&&g.po_number===n);f&&(s&&(s.textContent=f.receipt_code||"\u2014"),r&&(r.textContent=f.site_code||"\u2014"),i&&(i.textContent=Y(f.receipt_date)),l&&(l.textContent=f.supplier||"\u2014"),d&&(d.textContent=f.created_by||"Th\u1EE7 kho"),c&&(c.textContent=Math.round(Number(f.total_amount)||0).toLocaleString("vi-VN")+" \u20AB"),ie.receiptCode=f.receipt_code,ie.totalAmount=f.total_amount);let h=[];if(e){let p=await(await fetch(`/api/fnb/receipts?id=${encodeURIComponent(e)}`)).json();p.success&&p.data&&(h=p.data.lines||[])}else if(n){let p=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(n)}`)).json();p.success&&p.data&&(h=(p.data||[]).map(m=>({item_code:m.article,item_name:m.article_desc||m.article,unit:m.order_unit||"Ph\u1EA7n",qty:m.received_qty||m.order_qty,unit_price:m.net_price,amount:(m.received_qty||m.order_qty)*m.net_price,batch_code:m.batch_code||"L\xD4-SAP",exp_date:m.exp_date||null})))}if(!h.length){u&&(u.innerHTML='<tr><td colspan="9" class="p-6 text-center text-gray-400">Kh\xF4ng c\xF3 d\xF2ng h\xE0ng n\xE0o \u0111\u01B0\u1EE3c ghi nh\u1EADn cho phi\u1EBFu n\xE0y.</td></tr>');return}u&&(u.innerHTML=h.map((g,p)=>{let m=Number(g.qty)||0,y=Number(g.unit_price)||0,x=Number(g.amount)||m*y,w=g.exp_date?Y(g.exp_date.slice(0,10)):"\u2014";return`
          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
            <td class="text-center num text-xs font-mono text-gray-400">${p+1}</td>
            <td class="col-code font-bold text-xs">${b(g.item_code)}</td>
            <td class="font-medium text-xs text-gray-900 dark:text-white">${b(g.item_name||g.item_code)}</td>
            <td class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300">${b(g.unit||"Ph\u1EA7n")}</td>
            <td class="col-num text-right num font-bold text-emerald-600 dark:text-emerald-400 text-xs">${T(m,1)}</td>
            <td class="col-num text-right num text-xs">${Math.round(y).toLocaleString("vi-VN")} \u20AB</td>
            <td class="col-num text-right num font-semibold text-gray-900 dark:text-white text-xs">${Math.round(x).toLocaleString("vi-VN")} \u20AB</td>
            <td class="text-center font-mono text-xs text-gray-700 dark:text-gray-300">${b(g.batch_code||"\u2014")}</td>
            <td class="col-date text-center num text-xs text-gray-600 dark:text-gray-400">${w}</td>
          </tr>
        `}).join(""))}catch(f){console.error("Error openWhReceivedOrderDetail:",f),u&&(u.innerHTML=`<tr><td colspan="9" class="p-6 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i chi ti\u1EBFt: ${f.message}</td></tr>`)}typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function kn(){let e=document.getElementById("whReceivedOrderDetailModal");e&&e.classList.add("hidden"),ie=null,typeof window<"u"&&(window.gWhCurrentReceivedDetail=null)}function Aa(){if(!ie)return;let{receiptId:e,poNumber:n,receiptCode:a,totalAmount:t}=ie;Ln(e,n,a,t)}async function Ln(e,n,a,t){let o=a||n||"\u0111\u01A1n h\xE0ng n\xE0y",s=t?Math.round(t).toLocaleString("vi-VN")+" \u20AB":"",r=`B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n H\u1EE6Y NH\u1EACP KHO cho \u0111\u01A1n h\xE0ng [${o}]`+(s?` v\u1EDBi gi\xE1 tr\u1ECB ${s}`:"")+`?

\u2022 To\xE0n b\u1ED9 s\u1ED1 l\u01B0\u1EE3ng nh\u1EADp kho s\u1EBD \u0111\u01B0\u1EE3c HO\xC0N T\xC1C TR\u1EEA KH\u1ECEI T\u1ED2N KHO th\u1EF1c t\u1EBF.
\u2022 \u0110\u01A1n h\xE0ng PO/PR s\u1EBD \u0111\u01B0\u1EE3c m\u1EDF l\u1EA1i (tr\u1EA1ng th\xE1i Ch\u1EDD nh\u1EADp) \u0111\u1EC3 c\xF3 th\u1EC3 nh\u1EADp l\u1EA1i khi c\u1EA7n.`;if(confirm(r))try{typeof showLoading=="function"&&showLoading("\u0110ang h\u1EE7y nh\u1EADp kho v\xE0 ho\xE0n t\xE1c t\u1ED3n kho...");let l=await(await fetch("/api/fnb/receipts/cancel",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e||void 0,po_number:n||void 0})})).json();l.success?(typeof showToast=="function"&&showToast(l.message||"H\u1EE7y nh\u1EADp kho th\xE0nh c\xF4ng!","success"),kn(),Tt()):typeof showToast=="function"&&showToast(`L\u1ED7i h\u1EE7y nh\u1EADp kho: ${l.error}`,"error")}catch(i){console.error("confirmCancelReceivedOrder error:",i),typeof showToast=="function"&&showToast(`L\u1ED7i k\u1EBFt n\u1ED1i: ${i.message}`,"error")}finally{typeof hideLoading=="function"&&hideLoading()}}function Da(){let e=pe&&pe.length?pe:V;if(!e||!e.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let n=document.getElementById("whInvSiteSelect")?.value||"ALL",t=[["STT","M\xE3 SKU","T\xEAn M\u1EB7t H\xE0ng","Nh\xF3m Ng\xE0nh H\xE0ng","\u0110\u01A1n V\u1ECB T\xEDnh","S\u1ED1 L\u01B0\u1EE3ng \u0110\xE3 Nh\u1EADp","S\u1ED1 L\u01B0\u1EE3ng T\u1ED3n S\u1ED5 S\xE1ch","\u0110\u01A1n Gi\xE1 Chu\u1EA9n (VN\u0110)","T\u1ED5ng Gi\xE1 Tr\u1ECB T\u1ED3n (VN\u0110)","S\u1ED1 L\xF4 Qu\u1EA3n L\xFD","Ng\xE0y Nh\u1EADp G\u1EA7n Nh\u1EA5t","Ng\xE0y Ki\u1EC3m K\xEA G\u1EA7n Nh\u1EA5t"]];e.forEach((d,c)=>{t.push([c+1,d.sku||"",d.name||"",d.category||"",d.unit||"",parseFloat(String(d.receipt_qty||0)),parseFloat(String(d.book_qty||0)),parseFloat(String(d.unit_price||0)),parseFloat(String(d.total_value||0)),parseInt(String(d.batch_count||0),10),d.last_receipt_date?String(d.last_receipt_date).split("T")[0]:"",d.last_count_date?String(d.last_count_date).split("T")[0]:""])});let o=XLSX.utils.book_new(),s=XLSX.utils.aoa_to_sheet(t),r=XLSX.utils.decode_range(s["!ref"]);s["!cols"]=[{wch:6},{wch:14},{wch:34},{wch:18},{wch:10},{wch:16},{wch:18},{wch:18},{wch:20},{wch:14},{wch:16},{wch:18}];for(let d=r.s.r;d<=r.e.r;++d)for(let c=r.s.c;c<=r.e.c;++c){let u=XLSX.utils.encode_cell({r:d,c});if(s[u])if(d===0)s[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let f="left",h;c===0||c===1||c===4||c===9||c===10||c===11?f="center":c===5||c===6?(f="right",h="#,##0.0"):(c===7||c===8)&&(f="right",h="#,##0");let g=c===6&&typeof s[u].v=="number"&&s[u].v<0;s[u].s={font:{name:"Aptos",sz:11,bold:c===6||c===8,color:{rgb:g?"C00000":"000000"}},alignment:{horizontal:f,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},h&&(s[u].z=h)}}s["!freeze"]={xSplit:0,ySplit:1},s["!autofilter"]={ref:s["!ref"]};let i=new Date().toISOString().slice(0,10).replace(/-/g,""),l=`Ton_Kho_WMS_${n}_${i}.xlsx`;XLSX.utils.book_append_sheet(o,s,"TonKhoWMS"),XLSX.writeFile(o,l),typeof showToast=="function"&&showToast(`\u0110\xE3 xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho ${n} th\xE0nh c\xF4ng!`,"success")}function Ra(){if(!re||!re.history){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u th\u1EBB kho \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let e=re,n=e.history||[];if(!n.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 ph\xE1t sinh giao d\u1ECBch n\xE0o \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let t=[["STT","Ng\xE0y Ch\u1EE9ng T\u1EEB","S\u1ED1 Ch\u1EE9ng T\u1EEB","Lo\u1EA1i Nghi\u1EC7p V\u1EE5","M\xE3 L\xF4","H\u1EA1n D\xF9ng (HSD)","S\u1ED1 L\u01B0\u1EE3ng Nh\u1EADp (+)","S\u1ED1 L\u01B0\u1EE3ng Xu\u1EA5t (-)","\u0110\u01A1n Gi\xE1 (VN\u0110)","Th\xE0nh Ti\u1EC1n (VN\u0110)","\u0110\u1ED1i T\xE1c / Nh\xE0 Cung C\u1EA5p","Ghi Ch\xFA / Di\u1EC5n Gi\u1EA3i"]];n.forEach((d,c)=>{t.push([c+1,d.doc_date?String(d.doc_date).split("T")[0]:"",d.doc_no||"",d.trans_name||d.trans_type||"",d.batch_code||"",d.exp_date?String(d.exp_date).split("T")[0]:"",parseFloat(String(d.qty_in||0)),parseFloat(String(d.qty_out||0)),parseFloat(String(d.unit_price||0)),parseFloat(String(d.amount||0)),d.partner_name||"",d.notes||""])});let o=XLSX.utils.book_new(),s=XLSX.utils.aoa_to_sheet(t),r=XLSX.utils.decode_range(s["!ref"]);s["!cols"]=[{wch:6},{wch:14},{wch:16},{wch:16},{wch:14},{wch:14},{wch:16},{wch:16},{wch:16},{wch:18},{wch:28},{wch:30}];for(let d=r.s.r;d<=r.e.r;++d)for(let c=r.s.c;c<=r.e.c;++c){let u=XLSX.utils.encode_cell({r:d,c});if(s[u])if(d===0)s[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let f="left",h;c===0||c===1||c===2||c===3||c===4||c===5?f="center":c===6||c===7?(f="right",h="#,##0.0"):(c===8||c===9)&&(f="right",h="#,##0"),s[u].s={font:{name:"Aptos",sz:11,bold:c===6||c===7,color:{rgb:"000000"}},alignment:{horizontal:f,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},h&&(s[u].z=h)}}s["!freeze"]={xSplit:0,ySplit:1},s["!autofilter"]={ref:s["!ref"]};let i=new Date().toISOString().slice(0,10).replace(/-/g,""),l=`The_Kho_${e.sku}_${e.site}_${i}.xlsx`;XLSX.utils.book_append_sheet(o,s,"TheKho"),XLSX.writeFile(o,l),typeof showToast=="function"&&showToast(`\u0110\xE3 xu\u1EA5t th\u1EBB kho m\xE3 ${e.sku} th\xE0nh c\xF4ng!`,"success")}if(typeof window<"u"){let e=window;e.gWhInventoryData=V,e.gWhFilteredInventory=pe,e.gWhActiveHistory=re,e.gWhActiveBatches=Oe,e.gWhReceivedOrders=se,e.gWhCurrentReceivedDetail=ie,e.loadWhInventory=wn,e.loadPoSap=wn,e.filterWhInventoryTable=xn,e.openWhItemHistoryModal=$a,e.openWhItemBatchesModal=Ba,e.switchWhInvSubView=Ha,e.populateWhReceivedOrdersSiteFilter=vn,e.loadWhReceivedOrders=Tt,e.filterWhReceivedOrdersTable=Na,e.renderWhReceivedOrdersTable=Lt,e.openWhReceivedOrderDetail=Fa,e.closeWhReceivedOrderDetailModal=kn,e.onWhRecModalCancelClick=Aa,e.confirmCancelReceivedOrder=Ln,e.exportWhInventoryToExcel=Da,e.exportWhItemHistoryToExcel=Ra}var U=[],je="ALL";async function Pa(){let e=document.getElementById("btnSyncFnbMonthly"),n=document.getElementById("iconSyncFnbMonthly"),a=document.getElementById("labelSyncFnbMonthly");try{e&&(e.disabled=!0),n&&n.classList.add("animate-spin"),a&&(a.textContent="\u0110ang \u0111\u1ED3ng b\u1ED9...");let o=document.getElementById("globalMonthPicker")?.value||new Date().toISOString().slice(0,7),r=await(await fetch("/api/fnb/chain/sync-monthly",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({month:o})})).json();r.success?(typeof showToast=="function"&&showToast(`\u0110\xE3 \u0111\u1ED3ng b\u1ED9 s\u1ED1 li\u1EC7u th\xE1ng ${o} th\xE0nh c\xF4ng (${r.count||14} \u0111i\u1EC3m b\xE1n)!`,"success"),await Tn()):typeof showToast=="function"&&showToast("L\u1ED7i \u0111\u1ED3ng b\u1ED9: "+(r.error||"Kh\xF4ng th\xE0nh c\xF4ng"),"error")}catch(t){console.error("triggerSyncFnbMonthlySummary error:",t),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi \u0111\u1ED3ng b\u1ED9: "+t.message,"error")}finally{e&&(e.disabled=!1),n&&n.classList.remove("animate-spin"),a&&(a.textContent="\u0110\u1ED3ng b\u1ED9 s\u1ED1 li\u1EC7u"),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}async function Tn(){try{typeof showLoading=="function"&&showLoading();let n=document.getElementById("globalMonthPicker")?.value||"2026-11",t=await(await fetch(`/api/fnb/chain?month=${encodeURIComponent(n)}`)).json();if(t.success&&t.data){let o=t.data;U=o.rankings||[],typeof renderKpi=="function"&&(renderKpi("chainTotalRevenue",{value:o.totalChainRevenue,sub:"14 \u0110i\u1EC3m b\xE1n to\xE0n h\u1EC7 th\u1ED1ng A.Kitchen"}),renderKpi("chainTotalProfit",{value:o.totalChainProfit,sub:"L\u1EE3i nhu\u1EADn g\u1ED9p to\xE0n chu\u1ED7i"}),renderKpi("chainAvgFoodCost",{text:`${o.avgFoodCostPct}%`,sub:"d\u01B0\u1EDBi ng\u01B0\u1EE1ng 43%",deltaGood:o.avgFoodCostPct<=43}),renderKpi("chainAvgLaborCost",{text:`${o.avgLaborCostPct}%`,sub:"d\u01B0\u1EDBi ng\u01B0\u1EE1ng 19%",deltaGood:o.avgLaborCostPct<=19}));let s=document.getElementById("chainAvgMargin");s&&(s.textContent=`${o.avgChainMargin}%`),Ve(U)}}catch(e){console.error("Error loadFnbChain:",e),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u to\xE0n chu\u1ED7i: "+e.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Ve(e){let n=document.getElementById("fnbChainTableBody"),a=document.getElementById("fnbChainMobileCards"),t=e||U;if(!t||t.length===0){n&&(n.innerHTML='<tr><td colspan="11" class="text-center py-8 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111i\u1EC3m b\xE1n n\xE0o ph\xF9 h\u1EE3p.</td></tr>'),a&&(a.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111i\u1EC3m b\xE1n n\xE0o ph\xF9 h\u1EE3p.</div>');return}n&&(n.innerHTML=t.map(o=>{let s="";o.status==="V\u01AF\u1EE2T CH\u1EC8 TI\xCAU"?s='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">V\u01AF\u1EE2T CH\u1EC8 TI\xCAU</span>':o.status==="TRONG M\u1EE8C"?s='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800">TRONG M\u1EE8C</span>':o.status==="CH\u01AFA PH\xC1T SINH"?s='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">CH\u01AFA PH\xC1T SINH</span>':s='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800">C\u1EA6N XEM X\xC9T</span>';let r="";o.rank===1?r='<span class="w-6 h-6 rounded-full bg-amber-400 text-gray-900 font-semibold inline-flex items-center justify-center text-xs shadow-xs">\u{1F947}1</span>':o.rank===2?r='<span class="w-6 h-6 rounded-full bg-gray-300 text-gray-900 font-semibold inline-flex items-center justify-center text-xs shadow-xs">\u{1F948}2</span>':o.rank===3?r='<span class="w-6 h-6 rounded-full bg-amber-700 text-white font-semibold inline-flex items-center justify-center text-xs shadow-xs">\u{1F949}3</span>':r=`<span class="tabular-nums font-mono text-gray-500 font-bold">${o.rank}</span>`;let i=parseFloat(String(o.achievementPct))||0,l=parseFloat(String(o.foodCostPct))||0;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center">${r}</td>
          <td class="py-3 px-4">
            <div class="font-bold text-gray-900 dark:text-white">${o.name}</div>
            <div class="text-xs font-mono tabular-nums text-gray-400">SAP: ${o.code}</div>
          </td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded text-xs font-bold ${o.region==="Mi\u1EC1n Nam"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300":"bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"}">${o.region}</span>
          </td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-gray-900 dark:text-white">${E(o.netRevenue)}</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums text-gray-500">${E(o.targetRevenue)}</td>
          <td class="py-3 px-3 text-center">
            <div class="font-mono tabular-nums font-bold text-gray-900 dark:text-white">${o.achievementPct}%</div>
            <div class="w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
              <div class="${i>=100?"bg-emerald-500":"bg-blue-500"} h-1.5 rounded-full" style="width: ${Math.min(100,i)}%"></div>
            </div>
          </td>
          <td class="py-3 px-3 text-center font-mono tabular-nums ${l<=43?"text-emerald-600 font-bold":"text-rose-600 font-bold"}">${o.foodCostPct}%</td>
          <td class="py-3 px-3 text-center font-mono tabular-nums text-purple-600 font-bold">${o.laborCostPct}%</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-emerald-600">${E(o.operatingProfit)}</td>
          <td class="py-3 px-3 text-center">${s}</td>
          <td class="py-3 px-3 text-center">
            <button onclick="viewSitePL('${o.code}')" class="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:hover:bg-brand-500 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all flex items-center gap-1 mx-auto">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
              <span>P&amp;L</span>
            </button>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(o=>{let s="";return o.status==="V\u01AF\u1EE2T CH\u1EC8 TI\xCAU"?s='<span class="badge badge-success text-xs">V\u01B0\u1EE3t ch\u1EC9 ti\xEAu</span>':o.status==="TRONG M\u1EE8C"?s='<span class="badge badge-brand text-xs">Trong m\u1EE9c</span>':o.status==="CH\u01AFA PH\xC1T SINH"?s='<span class="badge badge-neutral text-xs">Ch\u01B0a ph\xE1t sinh</span>':s='<span class="badge badge-danger text-xs">C\u1EA7n xem x\xE9t</span>',`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="font-bold text-brand-600 dark:text-brand-400 font-mono text-xs">#${o.rank} ${o.code}</span>
              ${s}
            </div>
            <span class="text-xs text-gray-400">${o.region}</span>
          </div>
          <div class="data-card-body space-y-2">
            <div class="font-bold text-sm text-gray-900 dark:text-white">${o.name}</div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span class="text-gray-400">Doanh thu:</span>
                <span class="font-mono font-bold text-gray-900 dark:text-white ml-1">${E(o.netRevenue)}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400">\u0110\u1EA1t ch\u1EC9 ti\xEAu:</span>
                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 ml-1">${o.achievementPct}%</span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-1 text-xs text-center pt-1 border-t border-gray-100 dark:border-gray-800">
              <div>
                <div class="text-gray-400 text-[10px]">Food Cost</div>
                <div class="font-mono font-bold ${parseFloat(String(o.foodCostPct))<=43?"text-emerald-600":"text-rose-600"}">${o.foodCostPct}%</div>
              </div>
              <div>
                <div class="text-gray-400 text-[10px]">Labor Cost</div>
                <div class="font-mono font-bold text-purple-600">${o.laborCostPct}%</div>
              </div>
              <div>
                <div class="text-gray-400 text-[10px]">EBITDA</div>
                <div class="font-mono font-bold text-emerald-600">${E(o.operatingProfit)}</div>
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewSitePL('${o.code}')" class="btn btn-secondary btn-sm">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> Xem P&L
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function Oa(e){je=e,["filterRegALL","filterRegMN","filterRegMB"].forEach(o=>{let s=document.getElementById(o);s&&(s.classList.remove("bg-brand-500","text-white","shadow-xs","font-bold"),s.classList.add("font-medium","text-gray-600","dark:text-gray-300"))});let n=e==="ALL"?"filterRegALL":e==="Mi\u1EC1n Nam"?"filterRegMN":"filterRegMB",a=document.getElementById(n);a&&(a.classList.remove("font-medium","text-gray-600","dark:text-gray-300"),a.classList.add("bg-brand-500","text-white","shadow-xs","font-bold"));let t=U;e!=="ALL"&&(t=U.filter(o=>o.region===e)),Ve(t)}function ja(e){let n=String(e||"").toLowerCase().trim(),a=U;je!=="ALL"&&(a=a.filter(t=>t.region===je)),n&&(a=a.filter(t=>t.code.toLowerCase().includes(n)||t.name.toLowerCase().includes(n)||t.region.toLowerCase().includes(n))),Ve(a)}var Ce=null;function Va(e){let n=document.getElementById("plSiteSelector");n&&(n.value=e);let a=document.getElementById("globalBranchSelect");a&&(a.value=e),typeof window.switchTab=="function"&&window.switchTab("fnb-pl"),Et()}async function Et(){try{typeof showLoading=="function"&&showLoading();let n=document.getElementById("globalBranchSelect")?.value||localStorage.getItem("orbit_user_site")||"K001",t=document.getElementById("globalMonthPicker")?.value||"2026-11",s=await(await fetch(`/api/fnb/pl?site=${encodeURIComponent(n)}&thang=${encodeURIComponent(t)}`)).json();if(s.success&&s.data){Ce=s.data,typeof window<"u"&&(window.currentPLData=Ce);let r=document.getElementById("plSiteSelector");r&&s.data.siteCode&&(r.value=s.data.siteCode),Cn(s.data);let i=document.getElementById("plFocusFilter")?.value||"ALL";En(i)}}catch(e){console.error("Error loadFnbPL:",e),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i P&L: "+e.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function En(e){let n=document.querySelector("#fnb-pl table tbody");if(!n)return;n.querySelectorAll("tr").forEach(t=>{let o=(t.textContent||"").toLowerCase();!e||e==="ALL"?t.style.display="":e==="COGS"?o.includes("gi\xE1 v\u1ED1n")||o.includes("food cost")||o.includes("nguy\xEAn v\u1EADt li\u1EC7u")||o.includes("doanh thu thu\u1EA7n")?t.style.display="":t.style.display="none":e==="LABOR"?o.includes("nh\xE2n s\u1EF1")||o.includes("labor")||o.includes("qu\u1EF9 l\u01B0\u01A1ng")||o.includes("doanh thu thu\u1EA7n")?t.style.display="":t.style.display="none":e==="OPEX"?o.includes("v\u1EADn h\xE0nh")||o.includes("thu\xEA")||o.includes("\u0111i\u1EC7n")||o.includes("c\u1ED1 \u0111\u1ECBnh")||o.includes("doanh thu thu\u1EA7n")?t.style.display="":t.style.display="none":e==="EBITDA"&&(o.includes("ebitda")||o.includes("l\u1EE3i nhu\u1EADn")||o.includes("doanh thu thu\u1EA7n")?t.style.display="":t.style.display="none")})}function Cn(e){if(!e)return;let n=document.getElementById("plSiteTitle");n&&(n.textContent=`B\xE1o C\xE1o P&L: ${e.site}`);let a=e.targetRevenue>0?e.netRevenue/e.targetRevenue*100:0;typeof renderKpi=="function"&&renderKpi("plNetRev",{value:e.netRevenue,sub:"Doanh thu sau chi\u1EBFt kh\u1EA5u"});let t=document.getElementById("plAchievement");if(t){let y=a>0?`${a.toFixed(1)}%`:"0,0%",x=a>=100;t.className=x?"kpi-delta-good":"kpi-delta-bad",t.innerHTML=`<svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="${x?"M12 19V5m0 0l-6 6m6-6l6 6":"M12 5v14m0 0l-6-6m6 6l6-6"}"/></svg><span class="font-mono tabular-nums">${y}</span><span class="sr-only">${x?"\u0111\u1EA1t":"ch\u01B0a \u0111\u1EA1t"}</span>`}let o=e.netRevenue>0?e.foodCost/e.netRevenue*100:0,s=e.netRevenue>0?e.laborCost/e.netRevenue*100:0,r=e.netRevenue>0?e.primeCost/e.netRevenue*100:0;typeof renderKpi=="function"&&renderKpi("plPrimeCostPct",{text:`${r.toFixed(1)}%`,sub:"M\u1EE5c ti\xEAu \u2264 62,0%",progress:Math.min(100,r/62*100)});let i=document.getElementById("plPrimeCostBar");i&&(i.style.width=`${Math.min(100,r/62*100)}%`,i.className=r>62?"kpi-progress-bar-error":"kpi-progress-bar");let l=document.getElementById("plFoodCostPct");l&&(l.textContent=`${o.toFixed(1)}%`);let d=document.getElementById("plFoodCostVal");d&&(d.textContent=E(e.foodCost));let c=document.getElementById("plLaborCostPct");c&&(c.textContent=`${s.toFixed(1)}%`);let u=document.getElementById("plLaborCostVal");u&&(u.textContent=E(e.laborCost)),typeof renderKpi=="function"&&(renderKpi("plProfitVal",{value:e.operatingProfit,sub:"L\u1EE3i nhu\u1EADn ho\u1EA1t \u0111\u1ED9ng"}),renderKpi("plBreakEven",{value:e.breakEvenRevenue,sub:"C\u1ED1 \u0111\u1ECBnh th\xE1ng"}));let f=document.getElementById("plProfitMargin");if(f){let y=e.profitMargin>=20;f.className=y?"kpi-delta-good":e.profitMargin>=0?"kpi-delta-neutral":"kpi-delta-bad",f.innerHTML=`<span class="font-mono tabular-nums">${e.profitMargin}%</span>`}let h=(y,x)=>{let w=document.getElementById(y);w&&(w.textContent=x)};h("plRowGross",E(e.grossRevenue)),h("plRowDiscount","-"+E(e.discount)),h("plRowNet",E(e.netRevenue)),e.channels&&(h("plRowDineIn",E(e.channels.dineIn)),h("plRowTakeaway",E(e.channels.takeaway)),h("plRowCatering",E(e.channels.catering))),h("plRowFoodCost",E(e.foodCost)),h("plRowFoodCostPct",e.netRevenue>0?`${(e.foodCost/e.netRevenue*100).toFixed(1)}%`:"0.0%"),h("plRowLaborCost",E(e.laborCost)),h("plRowLaborCostPct",e.netRevenue>0?`${(e.laborCost/e.netRevenue*100).toFixed(1)}%`:"0.0%"),h("plRowPrimeCost",E(e.primeCost)),h("plRowPrimeCostPct",e.netRevenue>0?`${(e.primeCost/e.netRevenue*100).toFixed(1)}%`:"0.0%"),h("plRowRent",E(e.rentCost)),h("plRowUtilities",E(e.utilityCost)),h("plRowSupplies",E(e.supplyCost)),h("plRowWaste",E(e.wasteCost)),h("plRowMarketing",E(e.marketingCost)),h("plRowTotalCost",E(e.totalCost)),h("plRowEBITDA",E(e.operatingProfit)),h("plRowEBITDAPct",`${e.profitMargin}%`);let g=document.getElementById("plWeeklyTrendBody");g&&e.weeklyTrends&&(g.innerHTML=e.weeklyTrends.map(y=>`
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30">
        <td class="py-1 px-2 font-bold font-mono text-xs">${y.week}</td>
        <td class="py-1 px-2 text-right font-mono text-xs">${E(y.netRevenue||y.netRev||0)}</td>
        <td class="py-1 px-2 text-center text-blue-600 font-bold font-mono text-xs">${y.foodCostPct}%</td>
        <td class="py-1 px-2 text-center text-purple-600 font-bold font-mono text-xs">${y.laborCostPct}%</td>
        <td class="py-1 px-2 text-right text-emerald-600 font-bold font-mono text-xs">${y.profitMargin||y.profitPct||0}%</td>
      </tr>
    `).join("")),e.opMetrics&&(h("plOpBillCount",`${e.opMetrics.avgDailyBills||0} bill`),h("plOpAvgBill",E(e.opMetrics.avgSpendPerBill||0)),h("plOpRevSeat",E(e.opMetrics.revenuePerSeatPerDay||0)),h("plOpOccupancy",`${e.opMetrics.peakOccupancyPct||78.5}%`));let p=document.getElementById("plTopDishesList");p&&e.topDishes&&(e.topDishes.length===0?p.innerHTML='<div class="text-xs text-gray-400 py-2 text-center">Ch\u01B0a ph\xE1t sinh m\xF3n trong k\u1EF3</div>':p.innerHTML=e.topDishes.map((y,x)=>`
        <div class="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/40">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950 text-brand-500 font-bold text-xs flex items-center justify-center font-mono">${x+1}</span>
            <span class="font-bold text-gray-800 dark:text-gray-200">${y.name}</span>
          </div>
          <div class="flex items-center gap-3 font-mono tabular-nums text-xs">
            <span class="text-gray-500">${y.qty} su\u1EA5t</span>
            <span class="font-bold text-gray-900 dark:text-white">${E(y.revenue||y.rev||0)}</span>
          </div>
        </div>
      `).join(""));let m=document.getElementById("plActionPlansList");m&&e.actionPlans&&(m.innerHTML=e.actionPlans.map(y=>`
      <div class="flex items-start gap-2 py-0.5">
        <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"></i>
        <span>${typeof y=="object"?y.task||JSON.stringify(y):y}</span>
      </div>
    `).join(""))}function Ua(e){let n=document.getElementById("globalBranchSelect");n&&(n.value=e),Et()}async function Wa(){try{typeof showLoading=="function"&&showLoading();let e=document.getElementById("globalBranchSelect")?.value||"K001",n=document.getElementById("posDatePicker"),a=n?.value||"2026-11-19",o=await(await fetch(`/api/fnb/pos?site=${encodeURIComponent(e)}&date=${encodeURIComponent(a)}`)).json();o.success&&o.data&&(o.data.date&&n&&n.value!==o.data.date&&(n.value=o.data.date),Sn(o.data))}catch(e){console.error("Error loadFnbPOS:",e),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i POS: "+e.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Sn(e){if(!e)return;typeof renderKpi=="function"&&(renderKpi("posDailyRevenue",{value:e.dailyRevenue||e.totalSalesToday||0,sub:"so v\u1EDBi TB tu\u1EA7n"}),renderKpi("posDailyBills",{value:e.totalBills||e.billsToday||0,unit:"bill",isCurrency:!1,sub:"S\u1ED1 giao d\u1ECBch thanh to\xE1n"}),renderKpi("posDailyAOV",{value:e.avgSpendPerBill||e.avgBillToday||0,sub:"Su\u1EA5t tr\u01B0a c\xF4ng s\u1EDF"}));let n=document.getElementById("posHourlyList");n&&e.hourlyDistribution&&(n.innerHTML=e.hourlyDistribution.map(a=>`
      <div>
        <div class="flex justify-between font-bold mb-1 font-mono text-xs">
          <span>${a.hour} (${a.bills} bills)</span>
          <span class="tabular-nums">${E(a.revenue||a.sales||0)} (${a.pct}%)</span>
        </div>
        <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
          <div class="bg-brand-500 h-2 rounded-full" style="width: ${a.pct}%"></div>
        </div>
      </div>
    `).join(""))}async function Ka(){try{typeof showLoading=="function"&&showLoading();let n=await(await fetch("/api/branches")).json();if(n.success&&Array.isArray(n.data)&&n.data.length>0)Ue(n.data);else{let a=(typeof getAppSitesList=="function"?getAppSitesList():[]).filter(t=>t.code!=="ALL");Ue(a)}}catch(e){console.error("Error loadFnbSites:",e);let n=(typeof getAppSitesList=="function"?getAppSitesList():[]).filter(a=>a.code!=="ALL");Ue(n)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Ue(e){let n=document.getElementById("fnbSitesMasterTableBody"),a=document.getElementById("fnbSitesMobileCards");if(!e)return;let t=document.getElementById("fnbSitesCountBadge");t&&(t.textContent=`${e.length} \u0111i\u1EC3m b\xE1n`),n&&(n.innerHTML=e.map(o=>{let s="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";return o.region==="Mi\u1EC1n B\u1EAFc"?s="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300":o.region==="Mi\u1EC1n Trung"&&(s="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300"),`
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-4 font-mono font-bold text-brand-500 dark:text-brand-400 text-xs">${o.code}</td>
          <td class="py-3 px-4 font-bold text-gray-900 dark:text-white">${o.name}</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded text-xs font-bold border ${s}">${o.region||"Mi\u1EC1n Nam"}</span>
          </td>
          <td class="py-3 px-4 text-gray-500 dark:text-gray-400">${o.address||"H\u1EC7 th\u1ED1ng c\u0103n tin T\xE2n Long Group"}</td>
          <td class="py-3 px-3">
            <div class="font-semibold text-gray-800 dark:text-gray-200">${o.site_type||"Qu\u1EA3n L\xFD C\u01A1 S\u1EDF"}</div>
            <div class="text-xs font-mono tabular-nums text-gray-400">${o.phone||"0903.xxx.xxx"}</div>
          </td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-gray-900 dark:text-white">${Number(o.budget||1e7).toLocaleString("vi-VN")} \u20AB</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">HO\u1EA0T \u0110\u1ED8NG</span>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=e.map(o=>{let s="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";return o.region==="Mi\u1EC1n B\u1EAFc"?s="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300":o.region==="Mi\u1EC1n Trung"&&(s="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300"),`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-xs text-brand-500 dark:text-brand-400">${o.code}</span>
              <span class="px-2 py-0.5 rounded text-xs font-bold border ${s}">${o.region||"Mi\u1EC1n Nam"}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">HO\u1EA0T \u0110\u1ED8NG</span>
          </div>
          <div class="font-bold text-xs text-gray-900 dark:text-white">${o.name}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5"></i>
            <span>${o.address||"H\u1EC7 th\u1ED1ng c\u0103n tin T\xE2n Long Group"}</span>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span class="text-gray-500">H\u1EA1n m\u1EE9c ng\xE2n s\xE1ch:</span>
            <span class="font-bold text-gray-900 dark:text-white font-mono tabular-nums">${Number(o.budget||1e7).toLocaleString("vi-VN")} \u20AB</span>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function Ga(){if(!U||U.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u x\u1EBFp h\u1EA1ng \u0111\u1EC3 xu\u1EA5t Excel","warning");return}try{if(typeof XLSX>"u"){typeof showToast=="function"&&showToast("L\u1ED7i: Th\u01B0 vi\u1EC7n xu\u1EA5t Excel ch\u01B0a s\u1EB5n s\xE0ng","error");return}let e=XLSX.utils.book_new(),n=["H\u1EA1ng","M\xE3 SAP","\u0110i\u1EC3m B\xE1n & B\u1EBFp \u0102n","V\xF9ng Mi\u1EC1n","Doanh Thu Thu\u1EA7n (VN\u0110)","M\u1EE5c Ti\xEAu Th\xE1ng (VN\u0110)","% \u0110\u1EA1t Ch\u1EC9 Ti\xEAu","Food Cost %","Labor Cost %","L\u1EE3i Nhu\u1EADn EBITDA (VN\u0110)","Bi\xEAn LN %","Tr\u1EA1ng Th\xE1i"],a=U.map(c=>[c.rank,c.code,c.name,c.region,c.netRevenue,c.targetRevenue,parseFloat(String(c.achievementPct))/100,parseFloat(String(c.foodCostPct))/100,parseFloat(String(c.laborCostPct))/100,c.operatingProfit,parseFloat(String(c.profitMargin))/100,c.status]),t=XLSX.utils.aoa_to_sheet([n,...a]),o={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:"center"}},s={font:{name:"Aptos",sz:11}},r={font:{name:"Aptos",sz:11},alignment:{horizontal:"center"}},i={font:{name:"Aptos",sz:11},alignment:{horizontal:"right"}},l=XLSX.utils.decode_range(t["!ref"]||"A1");for(let c=l.s.r;c<=l.e.r;++c)for(let u=l.s.c;u<=l.e.c;++u){let f=XLSX.utils.encode_cell({r:c,c:u});t[f]&&(c===0?t[f].s=o:u===0||u===1||u===3||u===11?t[f].s=r:u===2?t[f].s=s:u===6||u===7||u===8||u===10?(t[f].s=i,t[f].z="0.0%"):(t[f].s=i,t[f].z="#,##0"))}t["!freeze"]={xSplit:0,ySplit:1},t["!autofilter"]={ref:t["!ref"]},t["!cols"]=[{wch:8},{wch:10},{wch:38},{wch:14},{wch:22},{wch:20},{wch:14},{wch:14},{wch:14},{wch:22},{wch:12},{wch:16}],XLSX.utils.book_append_sheet(e,t,"XepHangChuoi");let d=new Date().toISOString().slice(0,10);XLSX.writeFile(e,`Orbit_Siba_Food_XepHangChuoi_${d}.xlsx`),typeof showToast=="function"&&showToast("\u0110\xE3 xu\u1EA5t file Excel x\u1EBFp h\u1EA1ng to\xE0n chu\u1ED7i th\xE0nh c\xF4ng (chu\u1EA9n Aptos).","success")}catch(e){console.error("L\u1ED7i exportFnbChainExcel:",e),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+e.message,"error")}}function Xa(){try{if(typeof XLSX>"u"){typeof showToast=="function"&&showToast("L\u1ED7i: Th\u01B0 vi\u1EC7n xu\u1EA5t Excel ch\u01B0a s\u1EB5n s\xE0ng","error");return}let e=Ce||(typeof window<"u"?window.currentPLData:null)||{},n=e.netRevenue||47045e4,a=e.grossRevenue||485e6,t=e.discount||1455e4,o=e.channels||{dineIn:Math.round(n*.72),takeaway:Math.round(n*.2),catering:Math.round(n*.08)},s=e.foodCost||Math.round(n*.428),r=e.laborCost||Math.round(n*.185),i=e.primeCost||s+r,l=e.rentCost||28e6,d=e.utilityCost||Math.round(n*.034),c=e.supplyCost||Math.round(n*.03),u=e.wasteCost||Math.round(n*.012),f=e.marketingCost||Math.round(n*.015),h=e.totalCost||s+r+l+d+c+u+f,g=e.operatingProfit||n-h,p=M=>n>0?M/n:0,m=XLSX.utils.book_new(),y=[["KHO\u1EA2N M\u1EE4C B\xC1O C\xC1O P&L","S\u1ED0 TI\u1EC0N (VN\u0110)","% DOANH THU THU\u1EA6N","GHI CH\xDA / \u0110\u1ECANH M\u1EE8C"],["1. Doanh thu g\u1ED9p (Gross Sales)",a,p(a),"Tr\u01B0\u1EDBc khuy\u1EBFn m\xE3i"],["(-) Chi\u1EBFt kh\u1EA5u / Khuy\u1EBFn m\xE3i POS",-t,p(-t),"Trong m\u1EE9c cho ph\xE9p <4%"],["2. DOANH THU THU\u1EA6N (Net Sales)",n,1,"Doanh thu chu\u1EA9n 100%"],["\u2022 \u0102n t\u1EA1i ch\u1ED7 (Dine-in)",o.dineIn,p(o.dineIn),"K\xEAnh ch\u1EE7 l\u1EF1c"],["\u2022 Mang \u0111i (Takeaway)",o.takeaway,p(o.takeaway),"K\xEAnh ph\u1EE5 tr\u1EE3"],["\u2022 Su\u1EA5t \u0103n c\xF4ng nghi\u1EC7p / Hub",o.catering,p(o.catering),"H\u1EE3p \u0111\u1ED3ng ngo\xE0i"],["3. Chi ph\xED Nguy\xEAn V\u1EADt Li\u1EC7u (Food Cost)",s,p(s),`M\u1EE5c ti\xEAu <=43.0% (${e.foodCostPct||(p(s)*100).toFixed(1)}%)`],["4. Chi ph\xED Nh\xE2n c\xF4ng tr\u1EF1c ti\u1EBFp (Labor Cost)",r,p(r),"M\u1EE5c ti\xEAu <=19.0% (18.5%)"],["5. PRIME COST (Food + Labor)",i,p(i),"M\u1EE5c ti\xEAu <=62.0%"],["6. Chi ph\xED M\u1EB7t b\u1EB1ng & Kh\u1EA5u hao",l,p(l),"Chi ph\xED c\u1ED1 \u0111\u1ECBnh"],["7. \u0110i\u1EC7n, N\u01B0\u1EDBc & Gas v\u1EADn h\xE0nh",d,p(d),"\u0110\u1ECBnh m\u1EE9c <=3.5%"],["8. V\u1EADt t\u01B0 ti\xEAu hao & CCDC",c,p(c),"\u0110\u1ECBnh m\u1EE9c tr\u1EA7n theo h\u1EA1n m\u1EE9c"],["9. Hao h\u1EE5t & H\u1ECFng h\u1EE7y",u,p(u),"Ch\u1EC9 ti\xEAu <=1.0%"],["10. Ti\u1EBFp th\u1ECB & POS",f,p(f),"Ch\u1EC9 ti\xEAu <=1.5%"],["T\u1ED4NG CHI PH\xCD HO\u1EA0T \u0110\u1ED8NG",h,p(h),"T\u1ED5ng chi ph\xED v\u1EADn h\xE0nh"],["L\u1EE2I NHU\u1EACN HO\u1EA0T \u0110\u1ED8NG (EBITDA)",g,p(g),`${e.profitMargin||(p(g)*100).toFixed(1)}% Doanh thu`]],x=XLSX.utils.aoa_to_sheet(y),w={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:"center"}},v={font:{name:"Aptos",sz:11}},L={font:{name:"Aptos",sz:11},alignment:{horizontal:"right"}},C=XLSX.utils.decode_range(x["!ref"]||"A1");for(let M=C.s.r;M<=C.e.r;++M)for(let F=C.s.c;F<=C.e.c;++F){let B=XLSX.utils.encode_cell({r:M,c:F});x[B]&&(M===0?x[B].s=w:F===0?x[B].s=v:F===1?(x[B].s=L,x[B].z="#,##0"):F===2?(x[B].s=L,x[B].z="0.0%"):x[B].s=v)}x["!freeze"]={xSplit:0,ySplit:1},x["!autofilter"]={ref:x["!ref"]},x["!cols"]=[{wch:45},{wch:22},{wch:20},{wch:30}],XLSX.utils.book_append_sheet(m,x,"PL_DiemBan"),XLSX.writeFile(m,`Orbit_Siba_Food_PL_Report_${new Date().toISOString().slice(0,10)}.xlsx`),typeof showToast=="function"&&showToast("\u0110\xE3 xu\u1EA5t B\xE1o C\xE1o P&L \u0110i\u1EC3m B\xE1n th\xE0nh c\xF4ng (chu\u1EA9n Aptos).","success")}catch(e){typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t P&L Excel: "+e.message,"error")}}if(typeof window<"u"){let e=window;e.gChainRankings=U,e.gCurrentFilterRegion=je,e.currentPLData=Ce,e.triggerSyncFnbMonthlySummary=Pa,e.loadFnbChain=Tn,e.renderFnbChainTable=Ve,e.filterFnbChainByRegion=Oa,e.onSearchChainSite=ja,e.viewSitePL=Va,e.loadFnbPL=Et,e.filterPlBreakdown=En,e.renderFnbPL=Cn,e.onSelectPLSite=Ua,e.loadFnbPOS=Wa,e.renderFnbPOS=Sn,e.loadFnbSites=Ka,e.renderFnbSites=Ue,e.exportFnbChainExcel=Ga,e.exportFnbPLExcel=Xa}var ge=[];function In(e){let n=Array.from(e.files||[]),a=20*1024*1024;n.forEach(t=>{if(t.size>a){typeof showToast=="function"&&showToast(`File "${t.name}" v\u01B0\u1EE3t qu\xE1 20MB, vui l\xF2ng ch\u1ECDn file nh\u1ECF h\u01A1n.`);return}ge.push({name:t.name,size:t.size,type:t.type||"DOCUMENT"})}),We(),e.value=""}function qa(e){In(e)}function We(){let e=document.getElementById("ctFileList");if(!e)return;let n=typeof window<"u"&&window.uploadedFiles?window.uploadedFiles:ge;if(!n.length){e.innerHTML="";return}e.innerHTML=n.map((a,t)=>`
    <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs">
      <div class="flex items-center gap-2 overflow-hidden">
        <i data-lucide="file-text" class="w-4 h-4 text-brand-600 shrink-0"></i>
        <span class="font-bold text-gray-800 dark:text-gray-100 truncate">${b(a.name)}</span>
        <span class="text-gray-400 dark:text-gray-500 font-mono tabular-nums text-xs">(${Math.round(a.size/1024)} KB)</span>
      </div>
      <button type="button" onclick="removeFile(${t})" class="text-rose-600 hover:text-rose-800 font-bold px-2 py-1 text-xs">X\xF3a</button>
    </div>
  `).join(""),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function za(e){(typeof window<"u"&&window.uploadedFiles?window.uploadedFiles:ge).splice(e,1),We()}function Ct(){let e=document.getElementById("ctNCC");e&&(e.value="");let n=document.getElementById("ctNguoiGiao");n&&(n.value="");let a=document.getElementById("ctNguoiNhan");a&&(a.value="");let t=document.getElementById("ctGhiChu");t&&(t.value="");let o=document.getElementById("ctFile");o&&(o.value=""),ge.length=0,typeof window<"u"&&(window.uploadedFiles=ge),We(),typeof showToast=="function"&&showToast("\u0110\xE3 l\xE0m m\u1EDBi form ch\u1EE9ng t\u1EEB")}function Qa(){Ct()}async function Mn(){let e=document.getElementById("ctSite")?.value||"",n=document.getElementById("ctLoai")?.value||"",a=document.getElementById("ctNgayXuat")?.value||"",t=document.getElementById("ctNgayNhan")?.value||"";if(!e){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn Site \xE1p d\u1EE5ng!");return}if(!n){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn Lo\u1EA1i h\xF3a \u0111\u01A1n / ch\u1EE9ng t\u1EEB!");return}if(!a||!t){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp Ng\xE0y xu\u1EA5t v\xE0 Ng\xE0y nh\u1EADn!");return}typeof showLoading=="function"&&showLoading("\u0110ang l\u01B0u ch\u1EE9ng t\u1EEB & t\u1EC7p \u0111\xEDnh k\xE8m...");let o=document.getElementById("btnLuuCT");o&&(o.disabled=!0);try{let s=typeof App<"u"&&App.user?App.user.email:"Th\u1EE7 kho Site",r={site:e,loaiHoaDon:n,ngayXuat:a,ngayNhan:t,nhaCungCap:document.getElementById("ctNCC")?.value.trim()||"",nguoiGiao:document.getElementById("ctNguoiGiao")?.value.trim()||"",nguoiNhan:document.getElementById("ctNguoiNhan")?.value.trim()||"",ghiChu:document.getElementById("ctGhiChu")?.value.trim()||"",nguoiNhap:s,files:ge.map(d=>({name:d.name,url:"https://drive.google.com/sample",type:d.type}))},l=await(await fetch("/api/voucher",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(l.success){let d=l.data?l.data.maCT:"CT-SUCCESS";typeof openGeneralModal=="function"&&openGeneralModal("L\u01B0u Ch\u1EE9ng T\u1EEB Th\xE0nh C\xF4ng",`
          <div class="text-center py-4 space-y-3">
            <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-title-sm font-bold">\u2713</div>
            <div class="text-base font-semibold text-gray-800 dark:text-gray-100">Ch\u1EE9ng t\u1EEB \u0111\xE3 \u0111\u01B0\u1EE3c l\u01B0u v\xE0o h\u1EC7 th\u1ED1ng!</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 font-mono tabular-nums">M\xE3 ch\u1EE9ng t\u1EEB: <b class="text-brand-600 text-sm">${b(d)}</b></div>
            <div class="text-xs text-gray-600 dark:text-gray-300">\u0110\xE3 c\u1EADp nh\u1EADt c\u01A1 s\u1EDF d\u1EEF li\u1EC7u Cloudflare D1. B\u1EA1n c\xF3 th\u1EC3 tra c\u1EE9u t\u1EA1i tab "Tra C\u1EE9u Ch\u1EE9ng T\u1EEB".</div>
            <button onclick="closeGeneralModal(); switchTab('portal-search');" class="mt-2 px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm">
              \u0110\u1EBFn Trang Tra C\u1EE9u
            </button>
          </div>
        `),Ct()}else typeof showToast=="function"&&showToast("L\u1ED7i: "+(l.error||"Kh\xF4ng th\u1EC3 l\u01B0u ch\u1EE9ng t\u1EEB"))}catch(s){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+s.message)}finally{typeof hideLoading=="function"&&hideLoading(),o&&(o.disabled=!1)}}function Ja(){return Mn()}function Ya(){let e=["M\xE3 Site","T\xEAn Site","Lo\u1EA1i h\xF3a \u0111\u01A1n","Ng\xE0y xu\u1EA5t h\xF3a \u0111\u01A1n (yyyy-mm-dd)","Ng\xE0y nh\u1EADn h\xE0ng (yyyy-mm-dd)","Nh\xE0 cung c\u1EA5p","Ng\u01B0\u1EDDi giao","Ng\u01B0\u1EDDi nh\u1EADn","Ghi ch\xFA","Link \u1EA3nh (Drive)"],n=[["K001","K001 - MN B\u1EBFp \u0102n \u0110\u1EA1i H\u1ECDc H\xF9ng V\u01B0\u01A1ng","H\xF3a \u0111\u01A1n GTGT","2026-11-15","2026-11-15","C\xF4ng ty TNHH Th\u1EF1c Ph\u1EA9m S\u1EA1ch","Nguy\u1EC5n V\u0103n Giao","Tr\u1EA7n Th\u1ECB Nh\u1EADn","H\xE0ng giao \u0111\u1EE7 s\u1ED1 l\u01B0\u1EE3ng, bao b\xEC nguy\xEAn v\u1EB9n","https://drive.google.com/file/d/1sample1/view"]];typeof exportStyledExcel=="function"&&(exportStyledExcel("Template_Import_Chung_Tu.xlsx","ImportChungTu",e,n,[],[0,3,4]),typeof showToast=="function"&&showToast("\u0110\xE3 t\u1EA3i template Excel import ch\u1EE9ng t\u1EEB v\u1EC1 m\xE1y!"))}function Za(e){let n=e.files&&e.files[0];if(!n)return;let a=document.getElementById("importInfo"),t=document.getElementById("importResult");a&&(a.textContent=`\u0110ang \u0111\u1ECDc file: ${n.name}...`);let o=new FileReader;o.onload=async function(s){try{let r=new Uint8Array(s.target?.result),i=XLSX.read(r,{type:"array"}),l=i.Sheets[i.SheetNames[0]],d=XLSX.utils.sheet_to_json(l,{defval:""});if(!d.length){typeof showToast=="function"&&showToast("File Excel kh\xF4ng c\xF3 d\xF2ng d\u1EEF li\u1EC7u n\xE0o!"),a&&(a.textContent=""),e.value="";return}let c=typeof App<"u"&&App.user?App.user.email:"Import Excel",u=d.map(g=>{let p=g["T\xEAn Site"]||g.Site||g["M\xE3 Site"]||"",m=g["Lo\u1EA1i h\xF3a \u0111\u01A1n"]||g["Lo\u1EA1i ch\u1EE9ng t\u1EEB"]||"H\xF3a \u0111\u01A1n GTGT",y=g["Ng\xE0y xu\u1EA5t h\xF3a \u0111\u01A1n (yyyy-mm-dd)"]||g["Ng\xE0y xu\u1EA5t"]||"",x=g["Ng\xE0y nh\u1EADn h\xE0ng (yyyy-mm-dd)"]||g["Ng\xE0y nh\u1EADn"]||"",w=g["Nh\xE0 cung c\u1EA5p"]||"",v=g["Ng\u01B0\u1EDDi giao"]||"",L=g["Ng\u01B0\u1EDDi nh\u1EADn"]||"",C=g["Ghi ch\xFA"]||"",M=g["Link \u1EA3nh (Drive)"]||g["Link \u1EA3nh"]||"";return{site:p,loaiHoaDon:m,ngayXuat:y,ngayNhan:x,nhaCungCap:w,nguoiGiao:v,nguoiNhan:L,ghiChu:C,linkAnh:M,nguoiNhap:c}}).filter(g=>g.site&&g.loaiHoaDon);if(!u.length){typeof showToast=="function"&&showToast("Kh\xF4ng t\xECm th\u1EA5y d\xF2ng n\xE0o h\u1EE3p l\u1EC7 (c\u1EA7n c\xF3 Site v\xE0 Lo\u1EA1i h\xF3a \u0111\u01A1n)!"),a&&(a.textContent=""),e.value="";return}typeof showLoading=="function"&&showLoading(`\u0110ang import ${u.length} ch\u1EE9ng t\u1EEB v\xE0o D1...`);let h=await(await fetch("/api/vouchers/import",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:u})})).json();h.success?(a&&(a.textContent=""),t&&(t.innerHTML=`
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <span>\u2713 <b>Th\xE0nh c\xF4ng:</b> \u0110\xE3 import ${h.count} ch\u1EE9ng t\u1EEB v\xE0o h\u1EC7 th\u1ED1ng Cloudflare D1.</span>
              <button onclick="switchTab('portal-search')" class="underline font-bold">Xem danh s\xE1ch</button>
            </div>
          `),typeof showToast=="function"&&showToast(`\u0110\xE3 import th\xE0nh c\xF4ng ${h.count} ch\u1EE9ng t\u1EEB!`)):typeof showToast=="function"&&showToast("L\u1ED7i: "+(h.error||"Kh\xF4ng th\u1EC3 import ch\u1EE9ng t\u1EEB"))}catch(r){typeof showToast=="function"&&showToast("L\u1ED7i \u0111\u1ECDc file Excel: "+r.message)}finally{typeof hideLoading=="function"&&hideLoading(),e.value=""}},o.readAsArrayBuffer(n)}var de=[];function er(){let e=document.getElementById("bcNguoiBaoCao"),n=document.getElementById("bcNguoiBaoCaoKhac");e&&n&&(e.value==="Kh\xE1c"?(n.classList.remove("hidden"),n.focus()):(n.classList.add("hidden"),n.value=""))}function tr(){let e=parseFloat(document.getElementById("bcSang")?.value||"0")||0,n=parseFloat(document.getElementById("bcTrua")?.value||"0")||0,a=parseFloat(document.getElementById("bcChieu")?.value||"0")||0,t=parseFloat(document.getElementById("bcNhanVien")?.value||"0")||0,o=parseFloat(document.getElementById("bcHuy")?.value||"0")||0,s=e+n+a+t+o,r=document.getElementById("bcTong");r&&(r.value=Math.round(s).toLocaleString("vi-VN"))}function nr(e){let n=Array.from(e.files||[]),a=20*1024*1024;n.forEach(t=>{if(t.size>a){typeof showToast=="function"&&showToast(`\u1EA2nh "${t.name}" v\u01B0\u1EE3t qu\xE1 20MB, b\u1ECF qua.`);return}let o=URL.createObjectURL(t);de.push({name:t.name,size:t.size,previewUrl:o})}),Ke(),e.value=""}function Ke(){let e=document.getElementById("bcAnhList");if(!e)return;let n=typeof window<"u"&&window.bcAnhFiles?window.bcAnhFiles:de;if(!n.length){e.innerHTML="";return}e.innerHTML=n.map((a,t)=>`
    <div class="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/80 aspect-square">
      <img src="${a.previewUrl}" class="w-full h-full object-cover">
      <button type="button" onclick="bcXoaAnh(${t})" class="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 shadow-sm" title="X\xF3a \u1EA3nh">
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
      <div class="absolute bottom-0 inset-x-0 bg-slate-900/60 text-[10px] text-white px-1.5 py-0.5 truncate font-mono tabular-nums">${b(a.name)}</div>
    </div>
  `).join(""),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function or(e){(typeof window<"u"&&window.bcAnhFiles?window.bcAnhFiles:de).splice(e,1),Ke()}function _n(){let e=document.getElementById("bcForm");e&&e.reset();let n=new Date,a=document.getElementById("bcNgay");a&&(a.value=n.toISOString().split("T")[0]);let t=document.getElementById("bcTong");t&&(t.value="0");let o=document.getElementById("bcNguoiBaoCaoKhac");o&&(o.classList.add("hidden"),o.value=""),de.length=0,typeof window<"u"&&(window.bcAnhFiles=de),Ke(),typeof showToast=="function"&&showToast("\u0110\xE3 l\xE0m m\u1EDBi form b\xE1o c\xE1o ca b\u1EBFp")}async function $n(){let e=document.getElementById("bcSite")?.value||"";if(!e){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn Site \u1EDF thanh \u0111i\u1EC1u h\u01B0\u1EDBng ph\xEDa tr\xEAn!");return}let n=document.getElementById("bcNgay")?.value||"";if(!n){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn Ng\xE0y b\xE1o c\xE1o!");return}let a=document.getElementById("bcNguoiBaoCao")?.value||"",t=document.getElementById("bcNguoiBaoCaoKhac")?.value.trim()||"",o=a==="Kh\xE1c"?t:a;if(!o){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn ho\u1EB7c nh\u1EADp Ng\u01B0\u1EDDi b\xE1o c\xE1o!");return}let s=parseFloat(document.getElementById("bcSang")?.value||"0")||0,r=parseFloat(document.getElementById("bcTrua")?.value||"0")||0,i=parseFloat(document.getElementById("bcChieu")?.value||"0")||0,l=parseFloat(document.getElementById("bcNhanVien")?.value||"0")||0,d=parseFloat(document.getElementById("bcHuy")?.value||"0")||0,c=s+r+i+l+d,u=document.getElementById("bcForm"),f={};u&&u.querySelectorAll("[name]").forEach(g=>{f[g.getAttribute("name")]=g.value}),typeof showLoading=="function"&&showLoading("\u0110ang g\u1EEDi b\xE1o c\xE1o v\u1EADn h\xE0nh ca b\u1EBFp...");let h=document.getElementById("btnGuiBaoCao");h&&(h.disabled=!0);try{let g=parseFloat(document.getElementById("bcStaffCoMat")?.value||"0")||0,p=parseFloat(document.getElementById("bcStaffVang")?.value||"0")||0,m={site:e,branchCode:e,reportDate:n,reporterName:o,plannedMeals:c,actualMeals:c-d,wastedMeals:d,staffActual:g,staffStandard:g+p,foodQualityNote:document.getElementById("bcTinhTrangNVL")?.value||"",feedback:document.getElementById("bcChiTietPhanHoi")?.value||"",extraCost:document.getElementById("bcPhatSinhChiPhi")?.value==="C\xF3"?1:0,images:de.map(w=>({name:w.name})),reportData:{...f,Site:e,"Ng\u01B0\u1EDDi b\xE1o c\xE1o":o,"T\u1ED5ng su\u1EA5t \u0103n \u0111\xE3 xu\u1EA5t":c,"\u1EA2nh \u0111\xEDnh k\xE8m":de.map(w=>w.name)}},x=await(await fetch("/api/report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)})).json();x.success?(typeof openGeneralModal=="function"&&openGeneralModal("G\u1EEDi B\xE1o C\xE1o Th\xE0nh C\xF4ng",`
          <div class="text-center py-4 space-y-3">
            <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-title-sm font-bold">\u2713</div>
            <div class="text-base font-semibold text-gray-800 dark:text-gray-100">\u0110\xE3 g\u1EEDi b\xE1o c\xE1o ca b\u1EBFp th\xE0nh c\xF4ng!</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Site: <b>${b(e)}</b> \xB7 Ng\xE0y: <b>${b(n)}</b></div>
            <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 inline-block font-mono tabular-nums text-xs">
              T\u1ED5ng su\u1EA5t \u0103n \u0111\xE3 xu\u1EA5t: <b class="text-emerald-700 text-sm font-semibold">${Math.round(c).toLocaleString("vi-VN")} su\u1EA5t</b>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">D\u1EEF li\u1EC7u \u0111\xE3 \u0111\u01B0\u1EE3c l\u01B0u tr\u1EEF an to\xE0n tr\xEAn Cloudflare D1.</div>
            <button onclick="closeGeneralModal();" class="mt-2 px-6 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm">
              \u0110\xE3 Hi\u1EC3u
            </button>
          </div>
        `),_n()):typeof showToast=="function"&&showToast("L\u1ED7i: "+(x.error||"Kh\xF4ng th\u1EC3 l\u01B0u b\xE1o c\xE1o"))}catch(g){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+g.message)}finally{typeof hideLoading=="function"&&hideLoading(),h&&(h.disabled=!1)}}function ar(){return $n()}function me(e){if(!e||e==="\u2014"||e==="null"||e==="undefined")return"\u2014";let n=String(e).trim();if(!n)return"\u2014";let a=n.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a){let[,o,s,r]=a;return`${r.padStart(2,"0")}/${s.padStart(2,"0")}/${o}`}let t=new Date(n);if(!isNaN(t.getTime())){let o=String(t.getDate()).padStart(2,"0"),s=String(t.getMonth()+1).padStart(2,"0"),r=t.getFullYear();return`${o}/${s}/${r}`}return n}function ye(e){return!e||e==="\u2014"||e==="null"?'<span class="text-gray-400">\u2014</span>':`<span class="code text-brand-600 dark:text-brand-400 font-semibold font-mono text-xs">${b(String(e))}</span>`}function Ge(e){return`<span class="num whitespace-nowrap font-mono text-xs">${me(e)}</span>`}function Xe(e,n){return!n||n==="\u2014"||n==="null"?'<span class="text-gray-400">\u2014</span>':`<span class="badge badge-${e||"neutral"} text-xs">${b(String(n))}</span>`}function qe(e){let n=parseInt(e,10)||0;return n?`<span class="file-chip font-mono text-xs" title="${n} t\u1EC7p \u0111\xEDnh k\xE8m"><svg class="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg><span>${n}</span></span>`:'<span class="text-gray-400">\u2014</span>'}function be(e){return!e||e==="unknown"||e==="N/A"||e==="undefined"||e==="null"||String(e).trim()===""?'<span class="text-gray-400">\u2014</span>':`<span class="text-gray-700 dark:text-gray-300 text-xs">${b(String(e))}</span>`}function St(e,n){let a=n||e||"\u2014";return`<span class="text-gray-900 dark:text-white font-medium truncate block max-w-[140px] text-xs" title="${b(a)}">${b(a)}</span>`}var D=[],G=[];function Bn(){typeof App<"u"&&(App.auditRawItems=D,App.auditItems=G),typeof window<"u"&&(window.auditRawItems=D,window.auditItems=G)}async function rr(){let e=document.getElementById("kkSite")?.value||"";typeof showLoading=="function"&&showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA theo site...");try{let a=await(await fetch(`/api/inventory-audit?site=${encodeURIComponent(e)}&no-cache=1`)).json(),t=document.getElementById("kkBody"),o=document.getElementById("kkMobileCards");a.success&&a.data&&a.data.length?(D=a.data,G=a.data,Bn(),Hn(a.meta||{}),ze()):(D=[],G=[],Bn(),t&&(t.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">\u0110i\u1EC3m b\xE1n n\xE0y ch\u01B0a c\xF3 danh m\u1EE5c m\u1EB7t h\xE0ng n\xE0o trong dim_article_stock.</td></tr>'),o&&(o.innerHTML='<div class="p-6 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">\u0110i\u1EC3m b\xE1n n\xE0y ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o.</div>'),Mt(0,0),typeof updateAuditKpisAndChart=="function"&&updateAuditKpisAndChart([]))}catch(n){console.error("loadAudit error:",n),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i b\u1EA3ng ki\u1EC3m k\xEA: "+n.message)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Hn(e){let n=document.getElementById("kkNganhSelect"),a=document.getElementById("kkNhomSelect");if(!n||!a)return;let t=n.value,o=e&&e.nganh_hang&&e.nganh_hang.length?e.nganh_hang:Array.from(new Set(D.map(s=>s.nganh_hang).filter(Boolean))).sort();n.innerHTML='<option value="">-- T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng --</option>'+o.map(s=>`<option value="${b(s)}">${b(s)}</option>`).join(""),o.includes(t)&&(n.value=t),It()}function It(){let e=document.getElementById("kkNganhSelect"),n=document.getElementById("kkNhomSelect");if(!n)return;let a=e?e.value:"",t=[];a?t=Array.from(new Set(D.filter(o=>o.nganh_hang===a).map(o=>o.nhom_hang).filter(Boolean))).sort():t=Array.from(new Set(D.map(o=>o.nhom_hang).filter(Boolean))).sort(),n.innerHTML='<option value="">-- T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng --</option>'+t.map(o=>`<option value="${b(o)}">${b(o)}</option>`).join(""),ze()}function ze(){let n=(document.getElementById("kkSearchInput")?.value||"").trim().toLowerCase(),t=document.getElementById("kkNganhSelect")?.value||"",s=document.getElementById("kkNhomSelect")?.value||"",i=document.getElementById("kkPriceSelect")?.value||"ALL",d=document.getElementById("kkStatusSelect")?.value||"ALL",c=!!(n||t||s||i!=="ALL"||d!=="ALL"),u=document.getElementById("kkActiveFilterBadge");u&&u.classList.toggle("hidden",!c);let f=D.filter(h=>{if(n){let x=(h.item_code||"").toLowerCase().includes(n),w=(h.item_name||"").toLowerCase().includes(n),v=(h.nganh_hang||"").toLowerCase().includes(n),L=(h.nhom_hang||"").toLowerCase().includes(n);if(!x&&!w&&!v&&!L)return!1}if(t&&h.nganh_hang!==t||s&&h.nhom_hang!==s)return!1;let g=parseFloat(String(h.price||0))||0;if(i==="WITH_PRICE"&&g<=0||i==="NO_PRICE"&&g>0)return!1;let p=h.closing_t10||h.closing_t9||0,m=h.usage_t11,y=m!=null;if(d==="COUNTED"&&!y||d==="UNCOUNTED"&&y)return!1;if(d==="DIFF"){let x=p-(m||0);if(Math.abs(x-p)<1e-4&&(!m||m===0))return!1}return!0});G=f,Bn(),Nn(f),Mt(f.length,D.length),typeof updateAuditKpisAndChart=="function"&&updateAuditKpisAndChart(f)}function sr(e){let n=document.getElementById("kkStatusSelect");n&&(n.value=e),ze()}function ir(){let e=document.getElementById("kkSearchInput"),n=document.getElementById("kkNganhSelect"),a=document.getElementById("kkNhomSelect"),t=document.getElementById("kkPriceSelect"),o=document.getElementById("kkStatusSelect"),s=document.getElementById("kkDiscrepancyFilter");e&&(e.value=""),n&&(n.value=""),a&&(a.value=""),t&&(t.value="ALL"),o&&(o.value="ALL"),s&&(s.value="ALL"),It()}function Mt(e,n){let a=document.getElementById("kkFilteredCount"),t=document.getElementById("kkTotalCount");a&&(a.textContent=Math.round(e).toLocaleString("vi-VN")),t&&(t.textContent=Math.round(n).toLocaleString("vi-VN"))}function Nn(e){let n=document.getElementById("kkBody"),a=document.getElementById("kkMobileCards"),t=e||G;if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">Kh\xF4ng t\xECm th\u1EA5y s\u1EA3n ph\u1EA9m n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc / t\u1EEB kh\xF3a.</td></tr>'),a&&(a.innerHTML='<div class="p-6 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">Kh\xF4ng t\xECm th\u1EA5y s\u1EA3n ph\u1EA9m n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}n&&(n.innerHTML=t.map(o=>{let s=o.closing_t10||o.closing_t9||0,r=o.usage_t11!==null&&o.usage_t11!==void 0?o.usage_t11:0,i=s-r,l=parseFloat(String(o.price||0))||0,d=i*l,c=o.nhom_hang&&o.nhom_hang!=="Ch\u01B0a ph\xE2n lo\u1EA1i"?o.nhom_hang:o.nganh_hang||"V\u1EADt t\u01B0";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="col-code">${ye(o.item_code)}</td>
          <td>
            <div class="font-medium text-gray-900 dark:text-white text-xs">${b(o.item_name)}</div>
            <div class="code text-gray-400 dark:text-gray-500 text-[10px] font-mono">${b(o.warehouse_code||"Kho")}</div>
          </td>
          <td>
            <span class="badge badge-neutral max-w-[160px] truncate text-xs" title="${b(c)}">
              ${b(c)}
            </span>
          </td>
          <td class="text-center text-gray-600 dark:text-gray-300 font-medium text-xs">${b(o.unit||"")}</td>
          <td class="col-num text-right num font-mono text-xs">${l>0?Math.round(l).toLocaleString("vi-VN")+" \u20AB":'<span class="text-gray-400">0 \u20AB</span>'}</td>
          <td class="col-num text-right num font-medium text-gray-900 dark:text-white font-mono text-xs">${Math.round(s).toLocaleString("vi-VN")}</td>
          <td class="text-right">
            <input type="number" min="0" step="any" value="${r}"
              class="input num text-right h-8 py-1 w-24 text-xs font-mono"
              oninput="onAuditChange(${o.id}, this.value, ${s}, ${l})">
          </td>
          <td class="col-num text-right num font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs" id="aud-close-${o.id}">${Math.round(i).toLocaleString("vi-VN")}</td>
          <td class="col-num text-right num font-semibold text-gray-900 dark:text-white font-mono text-xs" id="aud-value-${o.id}">${Math.round(d).toLocaleString("vi-VN")} \u20AB</td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(o=>{let s=o.closing_t10||o.closing_t9||0,r=o.usage_t11!==null&&o.usage_t11!==void 0?o.usage_t11:0,i=s-r,l=parseFloat(String(o.price||0))||0,d=i*l,c=o.nhom_hang&&o.nhom_hang!=="Ch\u01B0a ph\xE2n lo\u1EA1i"?o.nhom_hang:o.nganh_hang||"V\u1EADt t\u01B0";return`
        <div class="data-card space-y-2.5">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-medium text-sm text-gray-900 dark:text-white">${b(o.item_name)}</div>
              <div class="code text-gray-400 mt-0.5 text-xs font-mono">M\xE3: ${b(o.item_code)} \u2022 \u0110VT: ${b(o.unit||"")} \u2022 Gi\xE1: <span class="num">${Math.round(l).toLocaleString("vi-VN")} \u20AB</span></div>
            </div>
            <span class="badge badge-neutral shrink-0 max-w-[120px] truncate text-xs">${b(c)}</span>
          </div>
          <div class="grid grid-cols-3 gap-2 text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div class="text-center">
              <div class="text-[10px] text-gray-500 dark:text-gray-400">T\u1ED3n \u0111\u1EA7u k\u1EF3</div>
              <div class="num font-semibold text-gray-900 dark:text-white font-mono">${Math.round(s).toLocaleString("vi-VN")}</div>
            </div>
            <div class="text-center">
              <div class="text-[10px] text-gray-500 dark:text-gray-400">S\u1EED d\u1EE5ng k\u1EF3</div>
              <input type="number" min="0" step="any" value="${r}"
                class="input num text-center h-8 py-1 w-full text-xs font-mono"
                oninput="onAuditChange(${o.id}, this.value, ${s}, ${l}); const c = document.getElementById('aud-mob-close-${o.id}'); if(c) c.innerText = Math.round(${s} - (parseFloat(this.value)||0)).toLocaleString('vi-VN'); const v = document.getElementById('aud-mob-value-${o.id}'); if(v) v.innerText = Math.round((${s} - (parseFloat(this.value)||0)) * ${l}).toLocaleString('vi-VN') + ' \u20AB';">
            </div>
            <div class="text-center">
              <div class="text-[10px] text-gray-500 dark:text-gray-400">T\u1ED3n cu\u1ED1i k\u1EF3</div>
              <div class="num font-semibold text-brand-600 dark:text-brand-400 font-mono" id="aud-mob-close-${o.id}">${Math.round(i).toLocaleString("vi-VN")}</div>
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 px-1">
            <span class="text-gray-500 dark:text-gray-400">Th\xE0nh ti\u1EC1n t\u1ED3n:</span>
            <span class="num font-semibold text-gray-900 dark:text-white font-mono" id="aud-mob-value-${o.id}">${Math.round(d).toLocaleString("vi-VN")} \u20AB</span>
          </div>
        </div>
      `}).join(""))}function dr(e,n,a,t=0){let o=D.find(s=>s.id==e);if(o){o.usage_t11=n===""?null:parseFloat(n)||0;let s=a-(o.usage_t11||0),r=document.getElementById(`aud-close-${e}`);r&&(r.textContent=Math.round(s).toLocaleString("vi-VN"));let i=document.getElementById(`aud-value-${e}`);i&&(i.textContent=Math.round(s*(parseFloat(String(o.price))||t||0)).toLocaleString("vi-VN")+" \u20AB")}}async function lr(){if(!D||!D.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 l\u01B0u!");return}typeof showLoading=="function"&&showLoading("L\u01B0u k\u1EBFt qu\u1EA3 ki\u1EC3m k\xEA...");try{let e={items:D.map(t=>{let o=t.closing_t10||t.closing_t9||0,s=t.usage_t11!==null&&t.usage_t11!==void 0?t.usage_t11:0;return{id:t.id,site_code:t.site_code,item_code:t.item_code,item_name:t.item_name,unit:t.unit,usage:s,closing:o-s}})},a=await(await fetch("/api/inventory-audit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json();a.success?typeof showToast=="function"&&showToast("L\u01B0u k\u1EBFt qu\u1EA3 ki\u1EC3m k\xEA th\xE0nh c\xF4ng!"):typeof showToast=="function"&&showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+(a.error||"Th\u1EA5t b\u1EA1i"))}catch(e){typeof showToast=="function"&&showToast("L\u1ED7i: "+e.message)}finally{typeof hideLoading=="function"&&hideLoading()}}function cr(){if(!G||!G.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u \u0111\u1EC3 xu\u1EA5t Excel!");return}let e=["M\xE3 H\xE0ng","T\xEAn H\xE0ng H\xF3a","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","Kho","\u0110VT","\u0110\u01A1n Gi\xE1 (\u20AB)","T\u1ED3n K\u1EF3 Tr\u01B0\u1EDBc","S\u1EED D\u1EE5ng K\u1EF3","T\u1ED3n Cu\u1ED1i K\u1EF3","Th\xE0nh Ti\u1EC1n T\u1ED3n (\u20AB)"],n=G.map(o=>{let s=o.closing_t10||o.closing_t9||0,r=o.usage_t11!==null&&o.usage_t11!==void 0?o.usage_t11:0,i=s-r,l=parseFloat(String(o.price||0))||0;return[o.item_code,o.item_name,o.nganh_hang||"",o.nhom_hang||"",o.warehouse_code||"Kho",o.unit||"",l,s,r,i,i*l]}),a=document.getElementById("kkSite")?.value||"Site",t=(typeof extractSiteCode=="function"?extractSiteCode(a):a)||"Site";typeof exportStyledExcel=="function"&&(exportStyledExcel(`Kiem_Ke_Ton_Kho_${t}.xlsx`,"KiemKe",e,n,[6,7,8,9,10],[0,4,5]),typeof showToast=="function"&&showToast(`\u0110\xE3 xu\u1EA5t b\xE1o c\xE1o ki\u1EC3m k\xEA ${t} th\xE0nh c\xF4ng!`))}if(typeof window<"u"){let e=window;e.uploadedFiles=ge,e.onChonFile=In,e.onSelectFiles=qa,e.renderUploadedFiles=We,e.removeFile=za,e.resetChungTuForm=Ct,e.resetVoucherForm=Qa,e.luuChungTuForm=Mn,e.saveVoucher=Ja,e.taiTemplateChungTu=Ya,e.importExcelChungTu=Za,e.bcAnhFiles=de,e.bcNguoiBaoCaoChange=er,e.tinhTongSuat=tr,e.bcChonAnh=nr,e.bcRenderAnh=Ke,e.bcXoaAnh=or,e.resetBaoCao=_n,e.guiBaoCao=$n,e.submitCateringReport=ar,e.auditRawItems=D,e.auditItems=G,e.loadAudit=rr,e.populateAuditFilters=Hn,e.onAuditNganhChange=It,e.filterAuditItems=ze,e.onKkDiscrepancyFilterChange=sr,e.resetAuditFilters=ir,e.updateAuditCounts=Mt,e.renderAuditList=Nn,e.onAuditChange=dr,e.saveAudit=lr,e.exportAuditExcel=cr,e.fmtDate=me,e.cellCode=ye,e.cellDate=Ge,e.cellBadge=Xe,e.cellFiles=qe,e.cellPerson=be,e.cellSite=St,e.escapeHtml=b}var X=null;async function J(){try{typeof showLoading=="function"&&showLoading();let n=await(await fetch("/api/auth/users-matrix")).json();if(!n.success||!n.data){typeof showToast=="function"&&showToast(n.error||"Kh\xF4ng th\u1EC3 t\u1EA3i d\u1EEF li\u1EC7u ma tr\u1EADn ph\xE2n quy\u1EC1n","error");return}X=n.data,typeof window<"u"&&(window.gUserMatrixData=X),Fn(n.data),Qe(n.data),Je(n.data)}catch(e){console.error("Error loadUserMatrix:",e),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi t\u1EA3i ma tr\u1EADn ph\xE2n quy\u1EC1n","error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Fn(e){let n=e.users||[],a=e.userPermissions||[],t=n.length,o=n.filter(u=>u.status==="ACTIVE"||!u.status).length,s=a.length,r=n.filter(u=>["ADMIN","KHO_TRUONG","KE_TOAN"].includes(u.role_code)).length,i=document.getElementById("userMatrixKpiTotal"),l=document.getElementById("userMatrixKpiActive"),d=document.getElementById("userMatrixKpiCustomOverrides"),c=document.getElementById("userMatrixKpiAdmins");i&&(i.textContent=t.toLocaleString("vi-VN")),l&&(l.textContent=o.toLocaleString("vi-VN")),d&&(d.textContent=s.toLocaleString("vi-VN")),c&&(c.textContent=r.toLocaleString("vi-VN"))}function ur(){let e=X||(typeof window<"u"?window.gUserMatrixData:null);e&&(Qe(e),Je(e))}function Se(e,n,a,t){let o=(t||[]).find(r=>r.user_email===e.email&&r.feature_code===n.code);if(o)return o.can_view===1?{isGranted:!0,type:"CUSTOM_GRANT",label:"C\u1EA5p ri\xEAng",badgeClass:"bg-brand-500 text-white"}:{isGranted:!1,type:"CUSTOM_REVOKE",label:"B\u1ECB kh\xF3a",badgeClass:"bg-rose-500 text-white"};if(e.role_code==="ADMIN")return{isGranted:!0,type:"ROLE_DEFAULT",label:"Role",badgeClass:"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"};if(e.role_code==="KHO_TRUONG"&&["fnb-stock","fnb-counts","fnb-receipts","fnb-sites","wh-dashboard","wh-stock","wh-reorder","wh-leadtime","wh-posap","portal-kiemke","portal-history","portal-order","portal-baocao"].includes(n.code))return{isGranted:!0,type:"ROLE_DEFAULT",label:"Role",badgeClass:"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"};let s=(a||[]).find(r=>r.role_code===e.role_code&&r.feature_code===n.code);return s&&s.can_view===1?{isGranted:!0,type:"ROLE_DEFAULT",label:"Role",badgeClass:"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}:{isGranted:!1,type:"NONE",label:"Kh\xF4ng",badgeClass:"bg-gray-100 dark:bg-gray-800 text-gray-400"}}function Qe(e){let n=document.getElementById("userMatrixTableHead"),a=document.getElementById("userMatrixTableBody");if(!n||!a)return;let t=e.users||[],o=e.features||[],s=e.rolePermissions||[],r=e.userPermissions||[],i=(document.getElementById("userMatrixSearchInput")?.value||"").trim().toLowerCase(),l=document.getElementById("userMatrixRoleFilter")?.value||"ALL",d=document.getElementById("userMatrixGroupFilter")?.value||"ALL",c=o.filter(g=>d==="ALL"||g.group===d),u=t.filter(g=>{if(l!=="ALL"&&g.role_code!==l)return!1;if(i){let p=(g.full_name||"").toLowerCase().includes(i),m=(g.email||"").toLowerCase().includes(i);if(!p&&!m)return!1}return!0}),f=[];c.forEach(g=>{let p=f.find(m=>m.group===g.group);p||(p={group:g.group,groupName:g.groupName,color:g.color,features:[]},f.push(p)),p.features.push(g)});let h=`
    <tr class="bg-gray-50/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800 select-none">
      <th rowspan="2" class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs sticky left-0 z-30 bg-gray-50 dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">STT</th>
      <th rowspan="2" class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs sticky left-12 z-30 bg-gray-50 dark:bg-gray-900 min-w-[220px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">Nh\xE2n S\u1EF1 &amp; Email</th>
      <th rowspan="2" class="py-3 px-3 text-center font-bold uppercase tracking-wider text-xs sticky left-[268px] z-30 bg-gray-50 dark:bg-gray-900 min-w-[130px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">Vai Tr\xF2 H\u1EC7 Th\u1ED1ng</th>
  `;if(f.forEach(g=>{let p=g.color==="rose"?"bg-rose-50/60 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300":g.color==="emerald"?"bg-emerald-50/60 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300":g.color==="amber"?"bg-amber-50/60 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300":g.color==="blue"?"bg-blue-50/60 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300":"bg-purple-50/60 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300";h+=`
      <th colspan="${g.features.length}" class="py-2.5 px-3 text-center font-semibold uppercase tracking-wider text-xs border-l border-gray-200 dark:border-gray-800 ${p}">
        ${b(g.groupName)} (${g.features.length})
      </th>
    `}),h+=`
      <th rowspan="2" class="py-3 px-3 text-center font-bold uppercase tracking-wider text-xs min-w-[100px] border-l border-gray-200 dark:border-gray-800">Thao T\xE1c</th>
    </tr>
    <tr class="bg-gray-50 dark:bg-white/3 border-b border-gray-200 dark:border-gray-800 text-xs">
  `,c.forEach(g=>{h+=`
      <th class="py-2 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 border-l border-gray-100 dark:border-gray-800 min-w-[110px]" title="${b(g.name)} (${b(g.code)})">
        <div class="flex items-center justify-center gap-1">
          <i data-lucide="${g.icon||"shield"}" class="w-3.5 h-3.5 text-gray-400"></i>
          <span class="truncate max-w-[95px]">${b(g.name)}</span>
        </div>
      </th>
    `}),h+="</tr>",n.innerHTML=h,u.length===0){a.innerHTML=`<tr><td colspan="${c.length+4}" class="text-center py-12 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi d\xF9ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>`;return}a.innerHTML=u.map((g,p)=>{let m=g.status==="LOCKED",y=Nt(g.full_name||g.email),x=g.avatar_url&&!g.avatar_url.includes("ui-avatars.com")?g.avatar_url:`https://ui-avatars.com/api/?name=${y}&background=465fff&color=fff&bold=true`,w=g.role_code==="ADMIN"?'<span class="px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">ADMIN</span>':g.role_code==="KHO_TRUONG"?'<span class="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">KHO_TR\u01AF\u1EDENG</span>':g.role_code==="BEP_TRUONG"?'<span class="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">B\u1EBEP_TR\u01AF\u1EDENG</span>':g.role_code==="KE_TOAN"?'<span class="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">K\u1EBE_TO\xC1N</span>':g.role_code==="QUAN_LY_VUNG"?'<span class="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">QL_V\xD9NG</span>':'<span class="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">NH\xC2N_VI\xCAN</span>',v=`
      <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors ${m?"opacity-60 bg-rose-50/20":""}">
        <td class="py-3 px-3 text-center font-mono tabular-nums text-gray-400 text-xs sticky left-0 z-20 bg-white dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">${p+1}</td>
        <td class="py-3 px-4 sticky left-12 z-20 bg-white dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
          <div class="flex items-center gap-2.5">
            <img src="${x}" class="size-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 shrink-0" alt="Avatar">
            <div class="min-w-0">
              <div class="font-bold text-gray-900 dark:text-white truncate max-w-[160px] text-xs">${b(g.full_name||"Ch\u01B0a \u0111\u1EB7t t\xEAn")}</div>
              <div class="text-xs text-gray-400 truncate max-w-[160px] font-mono" title="${b(g.email)}">${b(g.email)}</div>
            </div>
          </div>
        </td>
        <td class="py-3 px-3 text-center sticky left-[268px] z-20 bg-white dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
          <button onclick="openEditUserModal('${b(g.email)}')" class="hover:scale-105 transition-transform" title="B\u1EA5m \u0111\u1EC3 \u0111\u1ED5i vai tr\xF2 c\u1EE7a user n\xE0y">
            ${w}
          </button>
        </td>
    `;return c.forEach(L=>{let C=Se(g,L,s,r),M="",F="",B="";C.isGranted?C.type==="CUSTOM_GRANT"?(M="bg-brand-500 hover:bg-brand-600 text-white shadow-xs",F='<i data-lucide="check" class="w-3.5 h-3.5"></i>',B=`\u0110ang C\u1EA4P RI\xCANG. B\u1EA5m \u0111\u1EC3 C\u1EAET QUY\u1EC0N ${L.name}`):(M="bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs",F='<i data-lucide="check" class="w-3.5 h-3.5"></i>',B=`C\xF3 quy\u1EC1n theo vai tr\xF2 ${g.role_code}. B\u1EA5m \u0111\u1EC3 C\u1EAET QUY\u1EC0N ${L.name}`):C.type==="CUSTOM_REVOKE"?(M="bg-rose-500 hover:bg-rose-600 text-white shadow-xs",F='<i data-lucide="x" class="w-3.5 h-3.5"></i>',B=`\u0110\xE3 B\u1ECA C\u1EAET QUY\u1EC0N. B\u1EA5m \u0111\u1EC3 C\u1EA4P L\u1EA0I ${L.name}`):(M="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-400",F='<i data-lucide="minus" class="w-3.5 h-3.5"></i>',B=`Kh\xF4ng c\xF3 quy\u1EC1n. B\u1EA5m \u0111\u1EC3 C\u1EA4P QUY\u1EC0N ${L.name}`),v+=`
        <td class="py-2.5 px-2 text-center border-l border-gray-100 dark:border-gray-800/60">
          <div class="inline-flex flex-col items-center gap-1">
            <button
              onclick="toggleUserPermission('${b(g.email)}', '${b(L.code)}', ${C.isGranted}, '${C.type}')"
              class="size-7 rounded-lg ${M} flex items-center justify-center transition-all active:scale-90"
              title="${B}"
            >
              ${F}
            </button>
            <span class="text-[10px] px-1 py-0.2 rounded font-bold ${C.badgeClass}">${C.label}</span>
          </div>
        </td>
      `}),v+=`
        <td class="py-3 px-3 text-center border-l border-gray-100 dark:border-gray-800">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="openEditUserModal('${b(g.email)}')" class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Ch\u1EC9nh s\u1EEDa vai tr\xF2 & t\xE0i kho\u1EA3n">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="toggleUserStatusPrompt('${b(g.email)}', '${m?"ACTIVE":"LOCKED"}')" class="p-1.5 rounded-lg border ${m?"border-emerald-200 text-emerald-600 hover:bg-emerald-50":"border-rose-200 text-rose-600 hover:bg-rose-50"} transition-colors" title="${m?"M\u1EDF kh\xF3a t\xE0i kho\u1EA3n":"Kh\xF3a t\xE0i kho\u1EA3n"}">
              <i data-lucide="${m?"unlock":"lock"}" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `,v}).join(""),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function Je(e){let n=document.getElementById("userMatrixMobileCards");if(!n)return;let a=e.users||[],t=e.features||[],o=e.rolePermissions||[],s=e.userPermissions||[],r=(document.getElementById("userMatrixSearchInput")?.value||"").trim().toLowerCase(),i=document.getElementById("userMatrixRoleFilter")?.value||"ALL",l=a.filter(d=>{if(i!=="ALL"&&d.role_code!==i)return!1;if(r){let c=(d.full_name||"").toLowerCase().includes(r),u=(d.email||"").toLowerCase().includes(r);if(!c&&!u)return!1}return!0});if(l.length===0){n.innerHTML='<div class="text-center py-8 text-gray-400 text-xs">Kh\xF4ng t\xECm th\u1EA5y t\xE0i kho\u1EA3n n\xE0o.</div>';return}n.innerHTML=l.map(d=>{let c=Nt(d.full_name||d.email),u=d.avatar_url&&!d.avatar_url.includes("ui-avatars.com")?d.avatar_url:`https://ui-avatars.com/api/?name=${c}&background=465fff&color=fff&bold=true`,f=t.map(h=>{let g=Se(d,h,o,s),p=g.isGranted,m=g.type==="CUSTOM_REVOKE";return`
        <div class="flex items-center justify-between p-2 rounded-xl border border-gray-100 dark:border-gray-800 ${p?"bg-emerald-50/40 dark:bg-emerald-950/20":m?"bg-rose-50/40 dark:bg-rose-950/20":"bg-gray-50/50 dark:bg-gray-800/30"}">
          <div class="flex items-center gap-2 min-w-0">
            <i data-lucide="${h.icon||"shield"}" class="w-3.5 h-3.5 text-gray-400 shrink-0"></i>
            <span class="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">${b(h.name)}</span>
          </div>
          <button
            onclick="toggleUserPermission('${b(d.email)}', '${b(h.code)}', ${g.isGranted}, '${g.type}')"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${p?"bg-emerald-500 text-white":m?"bg-rose-500 text-white":"bg-gray-200 text-gray-600"}"
          >
            <span>${p?"B\u1EACT":"T\u1EAET"}</span>
            <span class="text-[8px] opacity-80">(${g.label})</span>
          </button>
        </div>
      `}).join("");return`
      <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3.5">
        <div class="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800/80 pb-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <img src="${u}" class="size-9 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 shrink-0" alt="Avatar">
            <div class="min-w-0">
              <div class="font-semibold text-xs text-gray-900 dark:text-white truncate">${b(d.full_name||"Ch\u01B0a \u0111\u1EB7t t\xEAn")}</div>
              <div class="text-xs text-gray-400 truncate font-mono">${b(d.email)}</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-xs px-2 py-0.5 rounded font-semibold bg-brand-50 text-brand-600 border border-brand-200">${d.role_code}</span>
            <button onclick="openEditUserModal('${b(d.email)}')" class="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
              <i data-lucide="more-vertical" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${f}
        </div>
      </div>
    `}).join(""),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}async function pr(e,n,a,t){try{let o=a?"REVOKE":"GRANT";if(X&&X.userPermissions){let l=X.userPermissions.find(d=>d.user_email===e&&d.feature_code===n);l?l.can_view=o==="GRANT"?1:0:X.userPermissions.push({user_email:e,feature_code:n,can_view:o==="GRANT"?1:0}),Qe(X),Je(X)}let r=await(await fetch("/api/auth/user-permissions/toggle",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userEmail:e,featureCode:n,action:o})})).json();if(!r.success){typeof showToast=="function"&&showToast(r.error||"Kh\xF4ng th\u1EC3 l\u01B0u ph\xE2n quy\u1EC1n","error"),J();return}typeof showToast=="function"&&showToast(r.message||"\u0110\xE3 c\u1EADp nh\u1EADt ph\xE2n quy\u1EC1n th\xE0nh c\xF4ng","success");let i=typeof window<"u"?window.gCurrentUser:null;if(i&&i.email===e){i.permissions||(i.permissions={}),o==="GRANT"?i.permissions[n]={canView:!0,canCreate:!0,canEdit:!0,canDelete:!0,isCustom:!0}:i.permissions[n]={canView:!1,canCreate:!1,canEdit:!1,canDelete:!1,isRevoked:!0};try{localStorage.setItem("orbit_user",JSON.stringify(i))}catch{}typeof applyUserSessionToUI=="function"&&applyUserSessionToUI()}}catch(o){console.error("Error toggleUserPermission:",o),typeof showToast=="function"&&showToast("L\u1ED7i m\u1EA1ng khi l\u01B0u ph\xE2n quy\u1EC1n","error"),J()}}async function gr(e,n){try{typeof showLoading=="function"&&showLoading();let t=await(await fetch("/api/auth/user-permissions/toggle",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userEmail:e,featureCode:n,action:"RESET"})})).json();t.success?(typeof showToast=="function"&&showToast("\u0110\xE3 kh\xF4i ph\u1EE5c quy\u1EC1n m\u1EB7c \u0111\u1ECBnh theo vai tr\xF2","info"),await J()):typeof showToast=="function"&&showToast(t.error||"Kh\xF4ng th\u1EC3 kh\xF4i ph\u1EE5c quy\u1EC1n","error")}catch{typeof showToast=="function"&&showToast("L\u1ED7i m\u1EA1ng khi kh\xF4i ph\u1EE5c quy\u1EC1n","error")}finally{typeof hideLoading=="function"&&hideLoading()}}function mr(){let e=document.getElementById("addUserModal");e&&e.classList.remove("hidden");let n=document.getElementById("addUserInputEmail");n&&n.focus()}function An(){let e=document.getElementById("addUserModal");e&&e.classList.add("hidden")}async function hr(e){e&&e.preventDefault();let n=document.getElementById("addUserInputEmail"),a=document.getElementById("addUserInputName"),t=document.getElementById("addUserInputRole"),o=(n?.value||"").trim(),s=(a?.value||"").trim(),r=t?.value||"NHAN_VIEN";if(!o){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp Email","warning");return}try{typeof showLoading=="function"&&showLoading();let l=await(await fetch("/api/auth/users/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,fullName:s,roleCode:r})})).json();l.success?(typeof showToast=="function"&&showToast(l.message||"Th\xEAm t\xE0i kho\u1EA3n th\xE0nh c\xF4ng","success"),An(),n&&(n.value=""),a&&(a.value=""),await J()):typeof showToast=="function"&&showToast(l.error||"Kh\xF4ng th\u1EC3 th\xEAm t\xE0i kho\u1EA3n","error")}catch{typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7","error")}finally{typeof hideLoading=="function"&&hideLoading()}}function fr(e){let n=typeof window<"u"?window.gUserMatrixData:null;if(!n||!n.users)return;let a=n.users.find(l=>l.email===e);if(!a)return;let t=document.getElementById("editUserTargetEmail"),o=document.getElementById("editUserEmailDisplay"),s=document.getElementById("editUserRoleSelect"),r=document.getElementById("editUserResetPermsToggle");t&&(t.value=a.email),o&&(o.textContent=`${a.email} (${a.full_name||"Ch\u01B0a \u0111\u1EB7t t\xEAn"})`),s&&(s.value=a.role_code||"NHAN_VIEN"),r&&(r.checked=!1);let i=document.getElementById("editUserModal");i&&i.classList.remove("hidden")}function _t(){let e=document.getElementById("editUserModal");e&&e.classList.add("hidden")}async function yr(e){e&&e.preventDefault();let n=document.getElementById("editUserTargetEmail")?.value,a=document.getElementById("editUserRoleSelect")?.value,t=document.getElementById("editUserResetPermsToggle")?.checked||!1;if(!(!n||!a))try{typeof showLoading=="function"&&showLoading();let s=await(await fetch("/api/auth/users/update-role",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userEmail:n,roleCode:a,resetPermissions:t})})).json();s.success?(typeof showToast=="function"&&showToast(s.message||"C\u1EADp nh\u1EADt vai tr\xF2 th\xE0nh c\xF4ng","success"),_t(),await J()):typeof showToast=="function"&&showToast(s.error||"L\u1ED7i khi c\u1EADp nh\u1EADt vai tr\xF2","error")}catch{typeof showToast=="function"&&showToast("L\u1ED7i m\u1EA1ng","error")}finally{typeof hideLoading=="function"&&hideLoading()}}async function br(){let e=document.getElementById("editUserTargetEmail")?.value;if(e&&confirm(`B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n x\xF3a t\u1EA5t c\u1EA3 ph\xE2n quy\u1EC1n ri\xEAng v\xE0 kh\xF4i ph\u1EE5c quy\u1EC1n m\u1EB7c \u0111\u1ECBnh theo vai tr\xF2 cho ${e}?`))try{typeof showLoading=="function"&&showLoading();let a=await(await fetch("/api/auth/user-permissions/reset-user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userEmail:e})})).json();a.success?(typeof showToast=="function"&&showToast(a.message||"\u0110\xE3 kh\xF4i ph\u1EE5c quy\u1EC1n m\u1EB7c \u0111\u1ECBnh th\xE0nh c\xF4ng","success"),_t(),await J()):typeof showToast=="function"&&showToast(a.error||"L\u1ED7i khi kh\xF4i ph\u1EE5c quy\u1EC1n","error")}catch{typeof showToast=="function"&&showToast("L\u1ED7i m\u1EA1ng","error")}finally{typeof hideLoading=="function"&&hideLoading()}}async function xr(e,n){if(confirm(`B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ${n==="ACTIVE"?"m\u1EDF kh\xF3a":"kh\xF3a"} t\xE0i kho\u1EA3n ${e}?`))try{typeof showLoading=="function"&&showLoading();let o=await(await fetch("/api/auth/users/toggle-status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userEmail:e,status:n})})).json();o.success?(typeof showToast=="function"&&showToast(o.message||"\u0110\xE3 c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i t\xE0i kho\u1EA3n","success"),await J()):typeof showToast=="function"&&showToast(o.error||"L\u1ED7i khi c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i","error")}catch{typeof showToast=="function"&&showToast("L\u1ED7i m\u1EA1ng","error")}finally{typeof hideLoading=="function"&&hideLoading()}}var Ye=null;function Ze(){if(typeof window<"u"&&window.gCurrentUser)return window.gCurrentUser;if(typeof loadPersistedUser=="function"){let e=loadPersistedUser();if(e&&typeof window<"u")return window.gCurrentUser=e,e}return null}function Ie(){let e=Ze();if(!e)return!1;if(e.role==="ADMIN"||e.roleCode==="ADMIN")return!0;if(e.permissions&&typeof e.permissions=="object"){let n=e.permissions["portal-search"],a=e.permissions["portal-voucher"];if(n&&n.canEdit!==void 0)return!!n.canEdit;if(a&&a.canEdit!==void 0)return!!a.canEdit}return e.role==="KE_TOAN"||e.roleCode==="KE_TOAN"}function Me(){let e=Ze();if(!e)return!1;if(e.role==="ADMIN"||e.roleCode==="ADMIN")return!0;if(e.permissions&&typeof e.permissions=="object"){let n=e.permissions["portal-search"],a=e.permissions["portal-voucher"];if(n&&n.canDelete!==void 0)return!!n.canDelete;if(a&&a.canDelete!==void 0)return!!a.canDelete}return e.role==="KE_TOAN"||e.roleCode==="KE_TOAN"}async function wr(e){if(!Ie()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa ch\u1EE9ng t\u1EEB","warning");return}typeof showLoading=="function"&&showLoading("\u0110ang t\u1EA3i th\xF4ng tin ch\u1EE9ng t\u1EEB...");try{let a=await(await fetch(`/api/voucher-detail?maCT=${encodeURIComponent(e)}`)).json();if(!a.success||!a.data)throw new Error(a.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt ch\u1EE9ng t\u1EEB");let t=a.data,o=document.getElementById("editVoucherCode");o&&(o.value=t.voucher_code||e);let s=document.getElementById("editVoucherSubtitle");s&&(s.textContent=`M\xE3: ${t.voucher_code||e}`);let r=document.getElementById("editVoucherSite");if(r){let x=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[])||[];r.innerHTML=x.map(w=>{let v=w.ten||w.name||w.code||w,L=t.site_name===v||t.site_name===w.name||t.site_name===w.code?"selected":"";return`<option value="${v}" ${L}>${v}</option>`}).join(""),t.site_name&&!x.some(w=>(w.ten||w.name||w.code)===t.site_name)&&r.insertAdjacentHTML("afterbegin",`<option value="${t.site_name}" selected>${t.site_name}</option>`)}let i=document.getElementById("editVoucherLoai");i&&(i.value=t.invoice_type||"H\xF3a \u0111\u01A1n GTGT");let l=document.getElementById("editVoucherNgayXuat");l&&(l.value=(t.invoice_date||"").slice(0,10));let d=document.getElementById("editVoucherNgayNhan");d&&(d.value=(t.receive_date||"").slice(0,10));let c=document.getElementById("editVoucherNCC");c&&(c.value=t.supplier_name||"");let u=document.getElementById("editVoucherNguoiGiao");u&&(u.value=t.deliverer_name||"");let f=document.getElementById("editVoucherNguoiNhan");f&&(f.value=t.receiver_name||"");let h=document.getElementById("editVoucherGhiChu");h&&(h.value=t.note||"");let g=document.getElementById("editVoucherFilesCount"),p=document.getElementById("editVoucherFilesList"),m=t.files||[];g&&(g.textContent=`${m.length} t\u1EC7p`),p&&(m.length?p.innerHTML=m.map(x=>`
          <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs">
            <span class="truncate text-gray-700 dark:text-gray-300 font-medium" title="${x.file_name}">${x.file_name}</span>
            <a href="${x.file_link}" target="_blank" class="text-brand-600 hover:underline shrink-0 ml-2 font-medium">Xem</a>
          </div>
        `).join(""):p.innerHTML='<div class="text-gray-400 italic text-[11px] py-1">Kh\xF4ng c\xF3 t\u1EC7p \u0111\xEDnh k\xE8m n\xE0o</div>');let y=document.getElementById("modalEditVoucher");y&&y.classList.remove("hidden")}catch(n){console.error("openEditVoucherModal error:",n),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i ch\u1EE9ng t\u1EEB: "+n.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Dn(){let e=document.getElementById("modalEditVoucher");e&&e.classList.add("hidden")}async function vr(){if(!Ie()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa ch\u1EE9ng t\u1EEB","warning");return}let e=document.getElementById("editVoucherCode")?.value;if(!e){typeof showToast=="function"&&showToast("Thi\u1EBFu m\xE3 ch\u1EE9ng t\u1EEB c\u1EA7n s\u1EEDa","warning");return}let n=document.getElementById("editVoucherSite")?.value||"",a=document.getElementById("editVoucherLoai")?.value||"",t=document.getElementById("editVoucherNgayXuat")?.value||"",o=document.getElementById("editVoucherNgayNhan")?.value||"",s=document.getElementById("editVoucherNCC")?.value||"",r=document.getElementById("editVoucherNguoiGiao")?.value||"",i=document.getElementById("editVoucherNguoiNhan")?.value||"",l=document.getElementById("editVoucherGhiChu")?.value||"",d=document.getElementById("btnSaveEditVoucher");d&&(d.disabled=!0,d.innerHTML='<span class="inline-block animate-spin mr-1">\u231B</span> \u0110ang l\u01B0u...');try{let u=await(await fetch("/api/voucher",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({maCT:e,site:n,loaiHoaDon:a,ngayXuat:t,ngayNhan:o,nhaCungCap:s,nguoiGiao:r,nguoiNhan:i,ghiChu:l})})).json();if(!u.success)throw new Error(u.error||"C\u1EADp nh\u1EADt kh\xF4ng th\xE0nh c\xF4ng");typeof showToast=="function"&&showToast("\u0110\xE3 c\u1EADp nh\u1EADt ch\u1EE9ng t\u1EEB th\xE0nh c\xF4ng","success"),Dn(),await $t()}catch(c){console.error("saveEditVoucher error:",c),typeof showToast=="function"&&showToast("L\u1ED7i c\u1EADp nh\u1EADt: "+c.message,"error")}finally{d&&(d.disabled=!1,d.innerHTML='<i data-lucide="save" class="w-3.5 h-3.5"></i><span>L\u01B0u thay \u0111\u1ED5i</span>',typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons())}}async function kr(e){if(!Me()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a ch\u1EE9ng t\u1EEB","warning");return}Ye=e;let n=document.getElementById("confirmDeleteVoucherCode");n&&(n.textContent=e);let a=document.getElementById("confirmDeleteVoucherInfo");a&&(a.innerHTML='<span class="text-gray-400">\u0110ang t\u1EA3i chi ti\u1EBFt...</span>');let t=document.getElementById("modalConfirmDeleteVoucher");t&&t.classList.remove("hidden"),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons();try{let s=await(await fetch(`/api/voucher-detail?maCT=${encodeURIComponent(e)}`)).json();if(s.success&&s.data&&a){let r=s.data;a.innerHTML=`
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div>\u0110i\u1EC3m b\xE1n: <b class="text-gray-900 dark:text-white">${r.site_name||"\u2014"}</b></div>
          <div>Lo\u1EA1i H\u0110: <b class="text-gray-900 dark:text-white">${r.invoice_type||"\u2014"}</b></div>
          <div>Ng\xE0y nh\u1EADn: <b class="num font-medium text-gray-900 dark:text-white font-mono">${me(r.receive_date)}</b></div>
          <div>NCC: <b class="text-gray-900 dark:text-white truncate block">${r.supplier_name||"\u2014"}</b></div>
        </div>
      `}}catch{}}function Rn(){let e=document.getElementById("modalConfirmDeleteVoucher");e&&e.classList.add("hidden"),Ye=null}async function Lr(){let e=Ye;if(!e)return;if(!Me()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a ch\u1EE9ng t\u1EEB","warning");return}let n=document.getElementById("btnExecuteDeleteVoucher");n&&(n.disabled=!0,n.innerHTML='<span class="inline-block animate-spin mr-1">\u231B</span> \u0110ang x\xF3a...');try{let t=await(await fetch("/api/voucher",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({maCT:e})})).json();if(!t.success)throw new Error(t.error||"X\xF3a ch\u1EE9ng t\u1EEB kh\xF4ng th\xE0nh c\xF4ng");typeof showToast=="function"&&showToast(`\u0110\xE3 x\xF3a th\xE0nh c\xF4ng ch\u1EE9ng t\u1EEB ${e}`,"success"),Rn(),typeof closeGeneralModal=="function"&&closeGeneralModal(),await $t()}catch(a){console.error("executeDeleteVoucher error:",a),typeof showToast=="function"&&showToast("L\u1ED7i khi x\xF3a: "+a.message,"error")}finally{n&&(n.disabled=!1,n.innerHTML='<i data-lucide="trash-2" class="w-3.5 h-3.5"></i><span>X\xE1c nh\u1EADn x\xF3a</span>',typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons())}}async function $t(){let e=Ze(),n=(typeof getActiveSite=="function"?getActiveSite():e?e.assignedSite:"")||"",a=document.getElementById("scSite"),t=n||(a?a.value:""),o=document.getElementById("scLoai")?.value||"",s=document.getElementById("scTu")?.value||"",r=document.getElementById("scDen")?.value||"",i=document.getElementById("scAuditFilter")?.value||"";typeof showLoading=="function"&&showLoading("Tra c\u1EE9u ch\u1EE9ng t\u1EEB...");try{let l=`/api/vouchers?site=${encodeURIComponent(t)}&loaiHoaDon=${encodeURIComponent(o)}&tuNgay=${encodeURIComponent(s)}&denNgay=${encodeURIComponent(r)}&_t=${Date.now()}`,c=await(await fetch(l,{cache:"no-store",headers:{"Cache-Control":"no-cache",Pragma:"no-cache"}})).json(),u=document.getElementById("scBody"),f=document.getElementById("scMobileCards");if(!c.success||!c.data||!c.data.length){u&&(u.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400 text-xs">Kh\xF4ng t\xECm th\u1EA5y ch\u1EE9ng t\u1EEB n\xE0o</td></tr>'),f&&(f.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">Kh\xF4ng t\xECm th\u1EA5y ch\u1EE9ng t\u1EEB n\xE0o</div>');return}let h=c.data;if(i==="HAS_IMG"?h=h.filter(m=>Number(m.soFile)>0):i==="NO_IMG"&&(h=h.filter(m=>!m.soFile||Number(m.soFile)===0)),!h.length){u&&(u.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400 text-xs">Kh\xF4ng t\xECm th\u1EA5y ch\u1EE9ng t\u1EEB n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc</td></tr>'),f&&(f.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">Kh\xF4ng t\xECm th\u1EA5y ch\u1EE9ng t\u1EEB n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc</div>');return}let g=Ie(),p=Me();u&&(u.innerHTML=h.map(m=>`
        <tr>
          <td class="col-code">${ye(m.maCT)}</td>
          <td>${St(m.site)}</td>
          <td class="col-badge">${Xe("neutral",m.loaiHoaDon)}</td>
          <td class="col-date">${Ge(m.ngayXuat)}</td>
          <td class="col-date">${Ge(m.ngayNhan)}</td>
          <td><span class="font-medium text-gray-900 dark:text-white text-xs">${m.nhaCungCap||"\u2014"}</span></td>
          <td>${be(m.nguoiNhap)}</td>
          <td class="col-badge text-center">${qe(m.soFile)}</td>
          <td class="col-actions text-right">
            <div class="flex items-center justify-end gap-1">
              <button onclick="viewVoucherDetail('${m.maCT}')" class="btn btn-sm btn-ghost text-gray-600 hover:text-brand-600 dark:text-gray-400" title="Xem chi ti\u1EBFt">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Xem</span>
              </button>
              ${g?`
                <button onclick="openEditVoucherModal('${m.maCT}')" class="btn btn-sm btn-ghost text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30" title="Ch\u1EC9nh s\u1EEDa ch\u1EE9ng t\u1EEB">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg>
                  <span>S\u1EEDa</span>
                </button>
              `:""}
              ${p?`
                <button onclick="confirmDeleteVoucher('${m.maCT}')" class="btn btn-sm btn-ghost text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30" title="X\xF3a ch\u1EE9ng t\u1EEB">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  <span>X\xF3a</span>
                </button>
              `:""}
            </div>
          </td>
        </tr>
      `).join("")),f&&(f.innerHTML=h.map(m=>`
        <div class="data-card space-y-3">
          <div class="flex items-center justify-between gap-2">
            ${ye(m.maCT)}
            ${Xe("neutral",m.loaiHoaDon)}
          </div>
          <div class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${m.site}</div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 font-mono">
            <div>Ng\xE0y nh\u1EADn: <b class="num text-gray-900 dark:text-white whitespace-nowrap">${me(m.ngayNhan)}</b></div>
            <div>NCC: <b class="text-gray-900 dark:text-white truncate block">${m.nhaCungCap||"\u2014"}</b></div>
            <div>Ng\u01B0\u1EDDi nh\u1EADp: <b>${be(m.nguoiNhap)}</b></div>
            <div>\u0110\xEDnh k\xE8m: <b>${qe(m.soFile)}</b></div>
          </div>
          <div class="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewVoucherDetail('${m.maCT}')" class="btn btn-secondary flex-1 text-xs py-2">
              <svg class="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>Chi ti\u1EBFt</span>
            </button>
            ${g?`
              <button onclick="openEditVoucherModal('${m.maCT}')" class="btn btn-secondary text-xs py-2 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg>
                <span>S\u1EEDa</span>
              </button>
            `:""}
            ${p?`
              <button onclick="confirmDeleteVoucher('${m.maCT}')" class="btn btn-secondary text-xs py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                <span>X\xF3a</span>
              </button>
            `:""}
          </div>
        </div>
      `).join(""))}catch(l){console.error("searchVouchers error:",l),typeof showToast=="function"&&showToast("L\u1ED7i tra c\u1EE9u ch\u1EE9ng t\u1EEB: "+l.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}async function Tr(e){typeof showLoading=="function"&&showLoading("T\u1EA3i chi ti\u1EBFt ch\u1EE9ng t\u1EEB...");try{let a=await(await fetch(`/api/voucher-detail?maCT=${encodeURIComponent(e)}`)).json();if(a.success&&a.data){let t=a.data,o="";t.files&&t.files.length?o=`
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div class="font-medium text-xs text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
              <span>T\u1EC7p \u0111\xEDnh k\xE8m & h\xECnh \u1EA3nh</span>
              <span class="badge badge-neutral">${t.files.length}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${t.files.map(l=>{let d=l.file_link&&l.file_link.match(/\/d\/([^/?]+)/),c=d?d[1]:null,u=l.file_type&&l.file_type.startsWith("image/")||/\.(jpe?g|png|gif|webp|bmp)$/i.test(l.file_name||"")||/\.(jpe?g|png|gif|webp|bmp)$/i.test(l.file_link||""),f=c&&u?`https://drive.google.com/thumbnail?id=${c}&sz=w600`:"";return`
                  <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 flex flex-col justify-between gap-2 shadow-2xs">
                    ${f?`
                      <div class="w-full h-36 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 relative cursor-pointer group" onclick="openImageLightbox('${l.file_link}', '${l.file_name}', '${l.file_type}')">
                        <img src="${f}" alt="${l.file_name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.parentElement.style.display='none';">
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path></svg>
                          <span>Ph\xF3ng to xem \u1EA3nh</span>
                        </div>
                      </div>
                    `:""}
                    <div class="flex items-center justify-between gap-2 min-w-0">
                      <div class="truncate text-xs font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1.5" title="${l.file_name}">
                        <svg class="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span class="truncate">${l.file_name}</span>
                      </div>
                      <div class="flex items-center gap-1 shrink-0">
                        <button onclick="openImageLightbox('${l.file_link}', '${l.file_name}', '${l.file_type}')" class="btn btn-sm btn-primary">
                          Xem
                        </button>
                        <a href="${l.file_link}" target="_blank" class="btn btn-sm btn-secondary p-1" title="M\u1EDF Drive tab m\u1EDBi">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                `}).join("")}
            </div>
          </div>
        `:o='<div class="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-center text-xs text-gray-400 italic">Kh\xF4ng c\xF3 t\u1EC7p \u0111\xEDnh k\xE8m ho\u1EB7c h\xECnh \u1EA3nh n\xE0o</div>';let s=Ie(),r=Me(),i=`
        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-2.5 p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800">
            <div><span class="text-gray-400">M\xE3 ch\u1EE9ng t\u1EEB:</span><br><b class="code text-sm text-brand-600 dark:text-brand-400 font-semibold font-mono">${t.voucher_code}</b></div>
            <div><span class="text-gray-400">Lo\u1EA1i h\xF3a \u0111\u01A1n:</span><br><b class="text-gray-800 dark:text-gray-200">${t.invoice_type}</b></div>
            <div><span class="text-gray-400">\u0110i\u1EC3m b\xE1n:</span><br><b class="text-gray-800 dark:text-gray-200">${t.site_name}</b></div>
            <div><span class="text-gray-400">Nh\xE0 cung c\u1EA5p:</span><br><b class="text-gray-800 dark:text-gray-200">${t.supplier_name||"\u2014"}</b></div>
            <div><span class="text-gray-400">Ng\u01B0\u1EDDi giao:</span><br>${be(t.deliverer_name)}</div>
            <div><span class="text-gray-400">Ng\u01B0\u1EDDi nh\u1EADn:</span><br>${be(t.receiver_name)}</div>
            <div><span class="text-gray-400">Ng\xE0y xu\u1EA5t H\u0110:</span><br><b class="num text-gray-800 dark:text-gray-200 font-mono">${me(t.invoice_date)}</b></div>
            <div><span class="text-gray-400">Ng\xE0y nh\u1EADn h\xE0ng:</span><br><b class="num text-gray-800 dark:text-gray-200 font-mono">${me(t.receive_date)}</b></div>
          </div>
          <div>
            <span class="text-gray-400">Ghi ch\xFA nghi\u1EC7p v\u1EE5:</span>
            <div class="p-2.5 mt-1 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">${t.note||"Kh\xF4ng c\xF3 ghi ch\xFA th\xEAm."}</div>
          </div>
          ${o}
          ${s||r?`
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
              ${s?`
                <button onclick="closeGeneralModal(); openEditVoucherModal('${t.voucher_code}')" class="btn btn-sm btn-secondary text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg>
                  <span>Ch\u1EC9nh s\u1EEDa ch\u1EE9ng t\u1EEB</span>
                </button>
              `:""}
              ${r?`
                <button onclick="closeGeneralModal(); confirmDeleteVoucher('${t.voucher_code}')" class="btn btn-sm btn-ghost text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  <span>X\xF3a ch\u1EE9ng t\u1EEB</span>
                </button>
              `:""}
            </div>
          `:""}
        </div>
      `;typeof openGeneralModal=="function"&&openGeneralModal(`Chi Ti\u1EBFt Ch\u1EE9ng T\u1EEB: ${e}`,i)}}catch(n){console.error("viewVoucherDetail error:",n),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i chi ti\u1EBFt: "+n.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Er(){let e=typeof window<"u"?window.gUserMatrixData:null;if(!e||!e.users||e.users.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u ma tr\u1EADn \u0111\u1EC3 xu\u1EA5t Excel","warning");return}try{if(typeof XLSX>"u"){typeof showToast=="function"&&showToast("L\u1ED7i: Th\u01B0 vi\u1EC7n xu\u1EA5t Excel ch\u01B0a s\u1EB5n s\xE0ng","error");return}let n=XLSX.utils.book_new(),a=e.users,t=e.features,o=e.rolePermissions,s=e.userPermissions,r=["STT","H\u1ECD V\xE0 T\xEAn","Email Google","Vai Tr\xF2 H\u1EC7 Th\u1ED1ng","Tr\u1EA1ng Th\xE1i","Ng\xE0y T\u1EA1o"];t.forEach(m=>{r.push(`${m.name} (${m.code})`)});let i=a.map((m,y)=>{let x=[y+1,m.full_name||"Ch\u01B0a \u0111\u1EB7t t\xEAn",m.email,m.role_code,m.status==="LOCKED"?"B\u1ECA KH\xD3A":"HO\u1EA0T \u0110\u1ED8NG",m.created_at?String(m.created_at).slice(0,10):""];return t.forEach(w=>{let v=Se(m,w,o,s),L="KH\xD4NG";v.isGranted?L=v.type==="CUSTOM_GRANT"?"C\u1EA4P RI\xCANG (\u2713)":"THEO ROLE (\u2713)":v.type==="CUSTOM_REVOKE"&&(L="B\u1ECA KH\xD3A (\u2715)"),x.push(L)}),x}),l=[r,...i],d=XLSX.utils.aoa_to_sheet(l),c={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:"center"}},u={font:{name:"Aptos",sz:11}},f={font:{name:"Aptos",sz:11},alignment:{horizontal:"center"}},h=XLSX.utils.decode_range(d["!ref"]||"A1");for(let m=h.s.r;m<=h.e.r;++m)for(let y=h.s.c;y<=h.e.c;++y){let x=XLSX.utils.encode_cell({r:m,c:y});d[x]&&(m===0?d[x].s=c:y===0||y===3||y===4||y===5||y>=6?d[x].s=f:d[x].s=u)}d["!autofilter"]={ref:d["!ref"]},d["!freeze"]={xSplit:3,ySplit:1,topLeftCell:"D2",activePane:"bottomRight",state:"frozen"};let g=[{wch:6},{wch:24},{wch:30},{wch:18},{wch:14},{wch:16}];t.forEach(()=>{g.push({wch:22})}),d["!cols"]=g,XLSX.utils.book_append_sheet(n,d,"Ma Tr\u1EADn Ph\xE2n Quy\u1EC1n");let p=`A.Kitchen_MaTran_PhanQuyen_${new Date().toISOString().slice(0,10)}.xlsx`;XLSX.writeFile(n,p),typeof showToast=="function"&&showToast("\u0110\xE3 xu\u1EA5t file Excel Ma Tr\u1EADn th\xE0nh c\xF4ng (Font Aptos)!","success")}catch(n){console.error("Error exportUserMatrixExcel:",n),typeof showToast=="function"&&showToast("L\u1ED7i khi xu\u1EA5t file Excel: "+n.message,"error")}}if(typeof window<"u"){let e=window;e.gUserMatrixData=X,e.loadUserMatrix=J,e.renderUserMatrixKPIs=Fn,e.filterUserMatrix=ur,e.resolveUserFeaturePermission=Se,e.renderUserMatrixTable=Qe,e.renderUserMatrixMobile=Je,e.toggleUserPermission=pr,e.resetUserFeaturePermission=gr,e.openAddUserModal=mr,e.closeAddUserModal=An,e.submitAddUser=hr,e.openEditUserModal=fr,e.closeEditUserModal=_t,e.submitEditUserRole=yr,e.resetUserAllPermsPrompt=br,e.toggleUserStatusPrompt=xr,e._pendingDeleteVoucherCode=Ye,e.getAppCurrentUser=Ze,e.canEditVouchers=Ie,e.canDeleteVouchers=Me,e.openEditVoucherModal=wr,e.closeEditVoucherModal=Dn,e.saveEditVoucher=vr,e.confirmDeleteVoucher=kr,e.closeDeleteVoucherModal=Rn,e.executeDeleteVoucher=Lr,e.searchVouchers=$t,e.viewVoucherDetail=Tr,e.exportUserMatrixExcel=Er}console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{ht as STANDARD_STEPS,Ye as _pendingDeleteVoucherCode,ea as addEditOrderItemLine,to as addManualReceiptItem,st as addWasteLineRow,Rr as api,G as auditItems,D as auditRawItems,de as bcAnhFiles,nr as bcChonAnh,er as bcNguoiBaoCaoChange,Ke as bcRenderAnh,or as bcXoaAnh,Ne as calcBudget,pt as canAuthenticateJourney,ae as canDeleteOrders,Me as canDeleteVouchers,oe as canEditOrders,Ie as canEditVouchers,Xe as cellBadge,ye as cellCode,Ge as cellDate,qe as cellFiles,be as cellPerson,St as cellSite,ua as changeStockPage,fa as clearStockSelection,An as closeAddUserModal,Vt as closeConfirmClearManualLinesModal,Rt as closeCreateReceiptModal,Gt as closeCreateWasteModal,yt as closeDeleteOrderModal,Rn as closeDeleteVoucherModal,dn as closeEditOrderModal,_t as closeEditUserModal,Dn as closeEditVoucherModal,No as closeInvDetailModal,Pt as closeManualReceiptModal,Pe as closeModal,zo as closeOrderJourneyModal,kn as closeWhReceivedOrderDetailModal,Ln as confirmCancelReceivedOrder,jt as confirmClearAllManualReceiptLines,na as confirmDeleteOrder,kr as confirmDeleteVoucher,Xo as currentJourneyData,Go as currentJourneyOrderCode,Ce as currentPLData,Ar as debounce,Ma as downloadRopExcel,A as editOrderItems,b as escapeHtml,lo as executeClearAllManualReceiptLines,oa as executeDeleteOrder,Lr as executeDeleteVoucher,cr as exportAuditExcel,Fo as exportCountSheetExcel,Ea as exportFefoToExcel,Ga as exportFnbChainExcel,Xa as exportFnbPLExcel,lt as exportFnbStockExcel,Ca as exportSelectedStockExcel,Er as exportUserMatrixExcel,Da as exportWhInventoryToExcel,Ra as exportWhItemHistoryToExcel,ze as filterAuditItems,ue as filterFefoLive,Oa as filterFnbChainByRegion,rn as filterHsOrders,Po as filterItems,hn as filterLeadTimeSla,fe as filterManualCatalogList,En as filterPlBreakdown,ur as filterUserMatrix,xn as filterWhInventoryTable,Na as filterWhReceivedOrdersTable,me as fmtDate,Fe as formatBatchCode,Ht as formatCompactVND,Y as formatDate,Fr as formatDateYMD,pn as formatItemQty,T as formatNumber,le as formatReceiptDateYMD,Ae as formatUnit,E as formatVND,U as gChainRankings,je as gCurrentFilterRegion,z as gFnbStockData,N as gFnbStockFilter,ct as gFnbStockSearchTerm,X as gUserMatrixData,Oe as gWhActiveBatches,re as gWhActiveHistory,ie as gWhCurrentReceivedDetail,pe as gWhFilteredInventory,V as gWhInventoryData,se as gWhReceivedOrders,Z as getActiveFnbCountSite,W as getActiveFnbReceiptSite,K as getActiveFnbWasteSite,Ze as getAppCurrentUser,ee as getAppItems,Nt as getCleanInitials,cn as getDangerBadgeClass,sa as getDaysRemainingMobileText,ra as getDaysRemainingText,un as getDaysTextColor,aa as getExpBadgeClass,ia as getExpDateColor,O as getReceiptExpWarningHtml,da as getSelectedStockSkus,la as getStockCurrentPage,_d as getWhActiveBatches,Md as getWhActiveHistory,Ed as getWhFilteredInventory,Td as getWhInventoryData,Hd as getWhReceivedOrders,$n as guiBaoCao,ni as handleExportFnbStockExcel,Za as importExcelChungTu,rr as loadAudit,_a as loadDashboardSummary,Tn as loadFnbChain,Ir as loadFnbCounts,zt as loadFnbCountsHistory,Et as loadFnbPL,Wa as loadFnbPOS,ce as loadFnbPoList,jn as loadFnbReceipts,Qn as loadFnbReceiptsHistory,Ka as loadFnbSites,Qt as loadFnbStock,Sr as loadFnbWaste,Wt as loadFnbWasteHistory,Wo as loadHistory,Ia as loadLeadTime,$e as loadManualCatalogItems,tn as loadQuota,Sa as loadReorderROP,vt as loadStockFEFO,J as loadUserMatrix,rt as loadWasteModalItems,wn as loadWhInventory,Tt as loadWhReceivedOrders,Mn as luuChungTuForm,dr as onAuditChange,It as onAuditNganhChange,In as onChonFile,_o as onCountInputChange,$o as onCountNoteChange,So as onFnbCountDateChange,Eo as onFnbCountFilterChange,To as onFnbCountNganhHangChange,Co as onFnbCountSearch,Io as onFnbCountSiteChange,Vn as onFnbPoSearchInput,Ao as onFnbStockFilterChange,Do as onFnbStockSearch,Ro as onFnbStockToggleValue,go as onFnbWasteFilterChange,po as onFnbWasteNganhHangChange,mo as onFnbWasteSearch,ho as onFnbWasteSiteChange,sr as onKkDiscrepancyFilterChange,ao as onManualLineBatchChange,ro as onManualLineExpChange,io as onManualLineLocChange,oo as onManualLinePriceChange,no as onManualLineQtyChange,Zn as onManualReceiptSiteChange,Oo as onQtyChange,Wn as onReceiptLineBatchChange,Kn as onReceiptLineExpChange,Xn as onReceiptLineNoteChange,Un as onReceiptLineQtyChange,ja as onSearchChainSite,qa as onSelectFiles,Ua as onSelectPLSite,bo as onWasteLineNoteChange,fo as onWasteLineQtyChange,yo as onWasteLineReasonChange,ko as onWasteModalItemSelect,Xt as onWasteModalLineQtyInput,vo as onWasteModalSiteChange,Aa as onWhRecModalCancelClick,mr as openAddUserModal,qn as openCreateReceiptModal,wo as openCreateWasteModal,va as openEditItemModal,Jo as openEditOrderModal,fr as openEditUserModal,wr as openEditVoucherModal,ba as openIssueModal,La as openItemDetailModal,Yn as openManualReceiptModal,qo as openOrderJourneyModal,At as openPoReceiptModal,ya as openReceiptModal,Ba as openWhItemBatchesModal,$a as openWhItemHistoryModal,Fa as openWhReceivedOrderDetail,Ee as parseQty,sn as pendingDeleteOrderCode,Hn as populateAuditFilters,it as populateFnbCountFilters,dt as populateFnbCountNhomHangDropdown,Kt as populateFnbWasteFilters,ot as populateFnbWasteNhomHangDropdown,Ut as populateFnbWasteSiteDropdown,vn as populateWhReceivedOrdersSiteFilter,ln as recalcEditOrderTotals,qt as recalculateWasteModalTotal,Zo as removeEditOrderItemLine,za as removeFile,Ot as removeManualReceiptLine,Nn as renderAuditList,Te as renderEditOrderItems,gn as renderFefoRows,Ve as renderFnbChainTable,q as renderFnbCountsTable,Cn as renderFnbPL,Sn as renderFnbPOS,tt as renderFnbPoTable,Ue as renderFnbSites,Be as renderFnbStock,ke as renderFnbWasteStockTable,mt as renderHsOrdersList,gt as renderJourneyBadge,ft as renderJourneyTimeline,kt as renderLeadTimeTable,we as renderManualReceiptLinesTable,He as renderOrderTable,Dt as renderReceiptLinesTable,mn as renderRopTable,yn as renderStockAlertsTable,We as renderUploadedFiles,Fn as renderUserMatrixKPIs,Je as renderUserMatrixMobile,Qe as renderUserMatrixTable,Lt as renderWhReceivedOrdersTable,ir as resetAuditFilters,_n as resetBaoCao,Ct as resetChungTuForm,ga as resetFefoFilters,br as resetUserAllPermsPrompt,gr as resetUserFeaturePermission,Qa as resetVoucherForm,Se as resolveUserFeaturePermission,jo as reviewOrder,lr as saveAudit,ta as saveEditOrder,vr as saveEditVoucher,Bo as saveFnbCountAudit,ka as saveItemSpecs,Ja as saveVoucher,$t as searchVouchers,R as selectedStockSkus,ut as setAppItems,so as setManualLineQuickExp,Gn as setReceiptLineQuickExp,ca as setStockCurrentPage,pa as sortStockBy,hr as submitAddUser,ar as submitCateringReport,zn as submitCreateReceipt,Lo as submitCreateWaste,xo as submitDirectWaste,yr as submitEditUserRole,wa as submitIssueToBackend,Qo as submitJourneyStep,co as submitManualReceipt,Vo as submitOrder,xa as submitReceiptToBackend,xe as switchFnbReceiptSubView,ve as switchFnbWasteSubView,Ha as switchWhInvSubView,Ya as taiTemplateChungTu,tr as tinhTongSuat,Mo as toggleBlindCount,eo as toggleManualShowAllCatalog,ma as toggleSelectAllStock,ha as toggleStockItemSelect,pr as toggleUserPermission,xr as toggleUserStatusPrompt,Pa as triggerSyncFnbMonthlySummary,fn as updateApexChartsTheme,Mt as updateAuditCounts,Yo as updateEditOrderItemQty,nt as updateManualTotals,Re as updateStockBulkBar,bn as updateTailadminDashboard,at as updateWasteKPIs,ge as uploadedFiles,Ho as viewCountDetail,Ko as viewOrderDetail,Jn as viewReceiptDetail,Va as viewSitePL,Tr as viewVoucherDetail,uo as viewWasteDetail};
