function S(t){return t==null||isNaN(t)?"0 \u20AB":Math.round(t).toLocaleString("vi-VN")+" \u20AB"}function re(t){if(t==null||isNaN(t))return{val:"\u2014",unit:"",full:"\u2014"};let o=Number(t),a=Math.abs(o),e=o<0?"-":"",n=o.toLocaleString("vi-VN")+" \u20AB";if(a>=1e9){let s=(a/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:e+s,unit:"t\u1EF7 \u20AB",full:n}}else if(a>=1e6){let s=(a/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:e+s,unit:"tr \u20AB",full:n}}else return{val:e+a.toLocaleString("vi-VN"),unit:"\u20AB",full:n}}function ba(t){if(!t)return"\u2014";if(typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t.trim()))return t.trim();try{let o=new Date(t);if(isNaN(o.getTime()))return String(t);let a=o.getFullYear(),e=String(o.getMonth()+1).padStart(2,"0"),n=String(o.getDate()).padStart(2,"0");return`${a}-${e}-${n}`}catch{return String(t)}}function G(t){if(!t)return"\u2014";try{let o=new Date(t);if(isNaN(o.getTime()))return String(t);let a=String(o.getDate()).padStart(2,"0"),e=String(o.getMonth()+1).padStart(2,"0"),n=o.getFullYear();return`${a}/${e}/${n}`}catch{return String(t)}}function L(t,o=1){return t==null||isNaN(t)?"0":Number(t).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:o})}function b(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function ya(t,o=200){let a=null;return function(...e){a&&clearTimeout(a),a=setTimeout(()=>{t.apply(this,e)},o)}}var se=class{cache=new Map;defaultTtl=3e4;async get(o,a=this.defaultTtl){let e=Date.now(),n=this.cache.get(o);if(n&&e-n.timestamp<a)return e-n.timestamp>1e4&&fetch(o).then(s=>s.json()).then(s=>{s.success&&this.cache.set(o,{timestamp:Date.now(),data:s})}).catch(()=>{}),n.data;try{let r=await(await fetch(o)).json();return r.success&&this.cache.set(o,{timestamp:e,data:r}),r}catch(s){return{success:!1,error:s instanceof Error?s.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(o,a){this.cache.clear();try{return await(await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).json()}catch(e){return{success:!1,error:e instanceof Error?e.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(o){if(!o){this.cache.clear();return}for(let a of this.cache.keys())a.includes(o)&&this.cache.delete(a)}async getPoList(o,a="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(o)}&status=${encodeURIComponent(a)}`)}async getPoDetails(o){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(o)}`)}async getReceiptHistory(o){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(o)}`)}async getInventory(o){return this.get(`/api/wh/inventory?site=${encodeURIComponent(o)}`)}async submitManualReceipt(o){return this.post("/api/fnb/manual-receipt",o)}},wa=new se;function V(){let t=localStorage.getItem("orbit_user_site");if(t)return t.toUpperCase();let o=window,a=typeof o.App<"u"&&o.App.currentBranch?o.App.currentBranch.toUpperCase():"K001";return a==="ALL"||!a?"K001":a}function at(t){if(!t||t==="\u2014")return"\u2014";let o=String(t).trim(),a=o.match(/^(\d{4})-(\d{2})-(\d{2})/);if(a)return`${a[1]}-${a[2]}-${a[3]}`;try{let e=new Date(o);if(!isNaN(e.getTime())){let n=e.getFullYear(),s=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${n}-${s}-${r}`}}catch{}return o.slice(0,10)}function A(t){if(!t)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let o=new Date;o.setHours(0,0,0,0);let a=new Date(t);a.setHours(0,0,0,0);let e=Math.ceil((a.getTime()-o.getTime())/(1e3*60*60*24));return e<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(e)} ng\xE0y)</span>`:e===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':e<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${e} ng\xE0y)</span>`:e<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${e} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${e} ng\xE0y</span>`}function ct(t){window.gFnbReceiptCurrentView=t;let o=document.getElementById("fnbReceiptTabBtnPo"),a=document.getElementById("fnbReceiptTabBtnHistory"),e=document.getElementById("fnbPoListView"),n=document.getElementById("fnbReceiptHistoryView");t==="po"?(o&&(o.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),a&&(a.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),e&&e.classList.remove("hidden"),n&&n.classList.add("hidden"),rt()):(a&&(a.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),n&&n.classList.remove("hidden"),e&&e.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function tn(t){let o=t||V(),a=document.getElementById("fnbReceiptFilterSite");a&&(a.value=o);let n=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(i=>i.code.toUpperCase()===o.toUpperCase()),s=n?n.ten||n.name:o,r=document.getElementById("fnbReceiptCurrentSiteBadge");r&&(r.textContent=s),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(o):await rt(o)}function en(t){Ht(t)}async function rt(t){let o=t||V(),a=document.getElementById("fnbPoStatusFilter"),e=a?a.value:"OPEN",n=document.getElementById("fnbPoSummaryText");try{n&&(n.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${o}...`);let r=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(o)}&status=${encodeURIComponent(e)}&no-cache=1`)).json();if(r.success&&r.data){window.gFnbPoList=r.data;let i=document.getElementById("fnbPoSearchInput")?.value||"";Ht(i);let l=(window.gFnbPoList||[]).filter(c=>c.status==="OPEN").length,d=document.getElementById("fnbReceiptBadgePendingCount");d&&(d.textContent=String(l))}else throw new Error(r.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(s){console.error("loadFnbPoList error:",s),n&&(n.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+s.message)}}function Ht(t=""){let o=document.getElementById("fnbPoTableBody"),a=document.getElementById("fnbPoMobileCards"),e=document.getElementById("fnbPoSummaryText"),n=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),s=(t||"").toLowerCase().trim(),r=window.gFnbPoList||[];n&&(r=r.filter(i=>{let l=(i.supplier_name||"").toLowerCase();return n==="siba"?l.includes("siba")||l.includes("b\u1EBFp trung t\xE2m")||l.includes("trung t\xE2m"):n==="baf"?l.includes("baf")||l.includes("th\u1ECBt"):n==="spice"?l.includes("gia v\u1ECB")||l.includes("\u0111\u01B0\u1EDDng")||l.includes("unilever")||l.includes("cholimex")||l.includes("mu\u1ED1i"):n==="veg"?l.includes("rau")||l.includes("\u0111\xE0 l\u1EA1t")||l.includes("c\u1EE7"):!0})),s&&(r=r.filter(i=>{let l=(i.po_number||"").toLowerCase(),d=(i.supplier_name||"").toLowerCase(),c=(i.supplier_code||"").toLowerCase();return l.includes(s)||d.includes(s)||c.includes(s)})),e&&(e.textContent=`Hi\u1EC3n th\u1ECB ${r.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),o&&(r.length===0?o.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':o.innerHTML=r.map(i=>{let l=i.status==="OPEN",d=i.status==="COMPLETED",c=d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':l?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',m=(i.po_number||"").startsWith("50000")||!i.supplier_code||i.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',f=Number(i.total_amount)||0,y=Number(i.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${b(i.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${b(at(i.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${m}
                <span class="font-medium text-gray-900 dark:text-white">${b(i.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${i.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${b(i.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${i.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${y.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${f>0?Math.round(f).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
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
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${b(i.po_number)} \u2022 ${b(at(i.doc_date))}</div>
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
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function ie(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+t+"...");let a=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}&no-cache=1`)).json();if(!a.success||!a.data)throw new Error(a.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let e=a.data;if(!e.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let n=e[0],s=document.getElementById("receiptModalInvoice"),r=document.getElementById("receiptModalInvoiceDisplay"),i=document.getElementById("receiptModalSite"),l=document.getElementById("receiptModalSiteDisplay"),d=document.getElementById("receiptModalSupplier"),c=document.getElementById("receiptModalSupplierDisplay"),u=document.getElementById("receiptModalDate"),m=new Date().toISOString().slice(0,10);s&&(s.value=n.po_number),r&&(r.textContent=n.po_number),i&&(i.value=n.site),l&&(l.textContent=n.site),d&&(d.value=n.supplier_name),c&&(c.textContent=n.supplier_name),u&&(u.value=m);let f="L\xD4-"+m.replace(/-/g,"").slice(2),y=new Date;y.setFullYear(y.getFullYear()+1);let p=y.toISOString().slice(0,10);window.gReceiptLines=e.map(g=>{let x=(g.merch_category||"").toLowerCase(),w=!x.includes("bao b\xEC")&&!x.includes("c\xF4ng c\u1EE5")&&!x.includes("h\xF3a ch\u1EA5t")&&!x.includes("t\u1EA1p ph\u1EA9m");return{po_item:g.po_item,item_code:g.item_code,item_name:g.item_name,merch_category:g.merch_category,unit:g.unit||"KG",unit_price:Number(g.unit_price)||0,order_qty:Number(g.order_qty)||0,actual_qty:Number(g.order_qty)||0,batch_code:f,exp_date:w?p:"",is_food:w,note:""}}),de();let h=document.getElementById("createReceiptModal");h&&h.classList.remove("hidden")}catch(o){console.error("openPoReceiptModal error:",o),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+o.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function de(){let t=document.getElementById("receiptLinesTableBody"),o=document.getElementById("receiptLinesMobileCards"),a=document.getElementById("receiptModalLineCount"),e=document.getElementById("receiptModalTotalAmount"),n=window.gReceiptLines||[];a&&(a.textContent=String(n.length));let s=0;t&&(t.innerHTML=n.map((r,i)=>{let l=(r.actual_qty||0)*(r.unit_price||0);return s+=l,`
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
                ${A(r.exp_date)}
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
      `}).join("")),o&&(o.innerHTML=n.map((r,i)=>{let l=(r.actual_qty||0)*(r.unit_price||0);return`
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
                ${A(r.exp_date)}
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
      `}).join("")),e&&(e.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function nn(t,o){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let a=parseFloat(o);window.gReceiptLines[t].actual_qty=isNaN(a)?0:a;let e=window.gReceiptLines[t],n=(e.actual_qty||0)*(e.unit_price||0),s=document.getElementById(`receiptLineTotal_${t}`);s&&(s.textContent=n>0?Math.round(n).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let r=document.getElementById(`receiptLineTotalMob_${t}`);r&&(r.textContent=n>0?Math.round(n).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let i=0;window.gReceiptLines.forEach(d=>{i+=(d.actual_qty||0)*(d.unit_price||0)});let l=document.getElementById("receiptModalTotalAmount");l&&(l.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function on(t,o){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].batch_code=o)}function an(t,o){if(!window.gReceiptLines||!window.gReceiptLines[t])return;window.gReceiptLines[t].exp_date=o;let a=document.getElementById(`receiptExpWarning_${t}`);a&&(a.innerHTML=A(o));let e=document.getElementById(`receiptExpWarningMob_${t}`);e&&(e.innerHTML=A(o)),window.lucide&&window.lucide.createIcons()}function rn(t,o){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let a=new Date;a.setMonth(a.getMonth()+o);let e=a.toISOString().slice(0,10);window.gReceiptLines[t].exp_date=e;let n=document.getElementById(`receiptLineExpInput_${t}`);n&&(n.value=e);let s=document.getElementById(`receiptLineExpInputMob_${t}`);s&&(s.value=e);let r=document.getElementById(`receiptExpWarning_${t}`);r&&(r.innerHTML=A(e));let i=document.getElementById(`receiptExpWarningMob_${t}`);i&&(i.innerHTML=A(e)),window.lucide&&window.lucide.createIcons()}function sn(t,o){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].note=o)}function le(){let t=document.getElementById("createReceiptModal");t&&t.classList.add("hidden")}function dn(){window.gFnbPoList&&window.gFnbPoList.length?ie(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function ln(){let o=(window.gReceiptLines||[]).filter(m=>(m.actual_qty||0)>0);if(!o.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let a=new Date;a.setHours(0,0,0,0);let e=!1;for(let m of o)if(m.exp_date){let f=new Date(m.exp_date);if(f.setHours(0,0,0,0),f<=a){e=!0;break}}if(e&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let n=document.getElementById("receiptModalSite")?.value||V(),s=document.getElementById("receiptModalInvoice")?.value||"",r=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),i=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",l=document.getElementById("receiptModalNotes")?.value||"",d=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",c={site_code:n,receipt_date:r,supplier:i,invoice_no:s,notes:l,created_by:d,lines:o.map(m=>({item_code:m.item_code,qty:m.actual_qty,unit_price:m.unit_price,batch_code:(m.batch_code||"").trim(),exp_date:(m.exp_date||"").trim()||null,note:m.note||""}))},u=document.getElementById("btnSubmitReceipt");u&&(u.disabled=!0,u.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let f=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)})).json();if(!f.success)throw new Error(f.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${f.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${n} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),le(),await rt(n),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(n),ct("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(m){console.error("submitCreateReceipt error:",m),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+m.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),u&&(u.disabled=!1,u.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function cn(t){let o=t||V(),a=document.getElementById("fnbReceiptsTableBody"),e=document.getElementById("fnbReceiptsMobileCards");try{let s=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(o)}&no-cache=1`)).json();if(s.success&&s.data){let r=s.data.receipts||[],i=document.getElementById("fnbReceiptBadgeHistoryCount");i&&(i.textContent=String(r.length)),a&&(r.length?a.innerHTML=r.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${b(l.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${b(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${b(at(l.receipt_date))}</td>
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
          `).join(""):a.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${b(o)}.</td></tr>`),e&&(r.length?e.innerHTML=r.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${b(l.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${b(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${b(at(l.receipt_date))} \u2022 PO: ${b(l.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${b(l.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(n){console.error("loadFnbReceiptsHistory error:",n)}}async function un(t){try{typeof window.showLoading=="function"&&window.showLoading();let a=await(await fetch(`/api/fnb/receipts?id=${t}`)).json();if(!a.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let e=a.data.lines||[],n=document.getElementById("invDetailModal"),s=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");s&&(s.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${t}`),r&&(r.textContent=`${e.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let i=`
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
            ${e.map(d=>`
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
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=i),n&&n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(o){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+o.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function pn(t){let o=t||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||V()||"K001",e=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(h=>h.code.toUpperCase()===o.toUpperCase()),n=e?e.ten||e.name:o,s=n.startsWith(o)?n:`${o} - ${n}`,r=document.getElementById("manualReceiptSiteNameDisplay");r&&(r.textContent=s);let i=document.getElementById("manualReceiptSiteSelect");i&&(i.value=o);let l=document.getElementById("manualReceiptSiteBadge");l&&(l.textContent=o);let d=document.getElementById("manualReceiptDate");d&&(d.value=new Date().toISOString().slice(0,10));let c=document.getElementById("manualReceiptSupplier");c&&!c.value&&(c.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let u=document.getElementById("manualReceiptInvoiceNo");u&&(u.value="");let m=document.getElementById("manualReceiptNotes");m&&(m.value="");let f=document.getElementById("manualItemSearchInput");f&&(f.value="");let y=document.getElementById("manualItemCategorySelect");y&&(y.value=""),window.gManualReceiptLines=[],ut();let p=document.getElementById("modalManualReceipt");p&&p.classList.remove("hidden"),await xt(o,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function ce(){let t=document.getElementById("modalManualReceipt");t&&t.classList.add("hidden")}async function gn(t){let o=document.getElementById("manualReceiptSiteBadge");o&&(o.textContent=t),await xt(t,window.gManualShowAllCatalog)}async function mn(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let t=document.getElementById("txtToggleManualCatalog");t&&(t.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let o=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await xt(o,window.gManualShowAllCatalog)}async function xt(t,o){let a=document.getElementById("manualCatalogListContainer");a&&(a.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let e=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}${o?"&include_all=1":""}`,s=await(await fetch(e)).json();s.success&&s.data?window.gManualSiteCatalog=s.data.items||[]:window.gManualSiteCatalog=[],lt()}catch(e){console.error("loadManualCatalogItems error:",e),a&&(a.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${b(e.message)}</div>`)}}function lt(){let t=document.getElementById("manualCatalogListContainer"),o=document.getElementById("manualCatalogCountText"),a=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),e=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),n=window.gManualSiteCatalog||[];if(a&&(n=n.filter(s=>{let r=(s.code||s.sku||"").toLowerCase(),i=(s.name||"").toLowerCase();return r.includes(a)||i.includes(a)})),e&&(n=n.filter(s=>(s.nhom_hang||s.item_group||s.nganh_hang||"").toLowerCase().includes(e))),o&&(o.textContent=String(n.length)),!!t){if(!n.length){t.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${a?`v\u1EDBi t\u1EEB kh\xF3a "${b(a)}"`:""}.
      </div>
    `;return}t.innerHTML=n.map(s=>{let r=s.code||s.sku,i=(window.gManualReceiptLines||[]).find(c=>c.item_code===r),l=parseFloat(s.book_qty||0),d=parseFloat(s.unit_price||0);return`
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
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function fn(t){let o=(window.gManualSiteCatalog||[]).find(e=>(e.code||e.sku)===t);if(!o)return;let a=(window.gManualReceiptLines||[]).find(e=>e.item_code===t);if(a)a.qty=Math.round((a.qty+1)*100)/100;else{let n="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),s=new Date;s.setFullYear(s.getFullYear()+1);let r=s.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:o.code||o.sku,item_name:o.name||o.code,unit:o.unit||"Ph\u1EA7n",unit_price:parseFloat(o.unit_price||0),qty:1,batch_code:n,exp_date:r,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}ut(),lt()}function ut(){let t=document.getElementById("manualLinesEmptyState"),o=document.getElementById("manualLinesTableWrapper"),a=document.getElementById("manualLinesMobileCards"),e=document.getElementById("btnClearAllManualLines"),n=document.getElementById("manualLinesTableBody"),s=document.getElementById("manualSelectedCountText"),r=document.getElementById("manualSummaryTotalSkus"),i=document.getElementById("manualSummaryTotalQty"),l=document.getElementById("manualSummaryTotalAmount"),d=window.gManualReceiptLines||[];if(s&&(s.textContent=String(d.length)),r&&(r.textContent=d.length+" m\xE3"),!d.length){t&&t.classList.remove("hidden"),o&&(o.classList.add("hidden"),o.classList.remove("lg:block")),a&&(a.classList.add("hidden"),a.classList.remove("block")),e&&(e.classList.add("hidden"),e.classList.remove("flex")),i&&(i.textContent="0"),l&&(l.textContent="0 \u0111");return}t&&t.classList.add("hidden"),o&&(o.classList.remove("hidden"),o.classList.add("lg:block")),a&&(a.classList.remove("hidden"),a.classList.add("block")),e&&(e.classList.remove("hidden"),e.classList.add("flex"));let c=0,u=0;n&&(n.innerHTML=d.map((m,f)=>{let y=(m.qty||0)*(m.unit_price||0);return c+=m.qty||0,u+=y,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${f+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${b(m.item_name)}">
              ${b(m.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${b(m.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${b(m.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${m.qty}" 
                   oninput="onManualLineQtyChange(${f}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${m.unit_price}" 
                   oninput="onManualLinePriceChange(${f}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${f}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${y>0?Math.round(y).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${b(m.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${f}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${m.exp_date||""}" 
                   onchange="onManualLineExpChange(${f}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${b(m.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${f}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${f})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=d.map((m,f)=>{let y=(m.qty||0)*(m.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${f+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${b(m.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${b(m.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${f})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${b(m.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${m.qty}" 
                     oninput="onManualLineQtyChange(${f}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${m.unit_price}" 
                     oninput="onManualLinePriceChange(${f}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${y>0?Math.round(y).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${b(m.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${f}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${m.exp_date||""}" 
                   onchange="onManualLineExpChange(${f}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),i&&(i.textContent=c>0?Number.isInteger(c)?String(c):c.toFixed(1):"0"),l&&(l.textContent=u>0?Math.round(u).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function hn(t,o){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let a=parseFloat(o);window.gManualReceiptLines[t].qty=isNaN(a)?0:a,Nt()}function bn(t,o){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let a=parseFloat(o);window.gManualReceiptLines[t].unit_price=isNaN(a)?0:a,Nt()}function Nt(){let t=0,o=0;(window.gManualReceiptLines||[]).forEach((n,s)=>{let r=(n.qty||0)*(n.unit_price||0);t+=n.qty||0,o+=r;let i=document.getElementById(`manualLineTotal_${s}`);i&&(i.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let a=document.getElementById("manualSummaryTotalQty"),e=document.getElementById("manualSummaryTotalAmount");a&&(a.textContent=t.toFixed(1)),e&&(e.textContent=Math.round(o).toLocaleString("vi-VN")+" \u0111")}function yn(t,o){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].batch_code=o)}function xn(t,o){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;window.gManualReceiptLines[t].exp_date=o;let a=document.getElementById(`manualLineExpWarning_${t}`);a&&(a.innerHTML=A(o),window.lucide&&window.lucide.createIcons())}function wn(t,o){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let a=new Date;a.setMonth(a.getMonth()+o);let e=a.toISOString().slice(0,10);window.gManualReceiptLines[t].exp_date=e;let n=document.getElementById(`manualLineExpInput_${t}`);n&&(n.value=e);let s=document.getElementById(`manualLineExpWarning_${t}`);s&&(s.innerHTML=A(e),window.lucide&&window.lucide.createIcons())}function vn(t,o){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].storage_loc=o)}function ue(t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=window.gManualReceiptLines[t];window.gManualReceiptLines.splice(t,1),ut(),typeof lt=="function"&&lt(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(o.item_name||o.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function pe(){let t=window.gManualReceiptLines||[];if(!t.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let o=document.getElementById("confirmClearManualCountText");o&&(o.textContent=String(t.length));let a=document.getElementById("modalConfirmClearManualLines");a&&(a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function ge(){let t=document.getElementById("modalConfirmClearManualLines");t&&t.classList.add("hidden")}function kn(){let t=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],ge(),ut(),lt(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${t} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function Ln(){let o=(window.gManualReceiptLines||[]).filter(y=>(y.qty||0)>0);if(!o.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let a=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!a){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let e=new Date;e.setHours(0,0,0,0);let n=!1;for(let y of o)if(y.exp_date){let p=new Date(y.exp_date);if(p.setHours(0,0,0,0),p<=e){n=!0;break}}if(n&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let s=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",r=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),i=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",l=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",d=(document.getElementById("manualReceiptNotes")?.value||"").trim(),c=`[${i}] ${d}`.trim(),u=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",m={site_code:s,receipt_date:r,supplier:a,invoice_no:l,notes:c,created_by:u,lines:o.map(y=>({item_code:y.item_code,qty:y.qty,unit_price:y.unit_price,batch_code:(y.batch_code||"").trim(),exp_date:(y.exp_date||"").trim()||null,storage_loc:y.storage_loc||"K\u1EC7 B\u1EBFp",note:y.note||""}))},f=document.getElementById("btnSubmitManualReceipt");f&&(f.disabled=!0,f.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let p=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)})).json();if(!p.success)throw new Error(p.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${p.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${s} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),ce(),await rt(s),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(s),ct("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(y){console.error("submitManualReceipt error:",y),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+y.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),f&&(f.disabled=!1,f.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var k=window;k.gFnbReceiptCurrentView=k.gFnbReceiptCurrentView||"po";k.gFnbPoList=k.gFnbPoList||[];k.gReceiptLines=k.gReceiptLines||[];k.gManualReceiptLines=k.gManualReceiptLines||[];k.gManualSiteCatalog=k.gManualSiteCatalog||[];k.gManualShowAllCatalog=k.gManualShowAllCatalog||!1;k.getActiveFnbReceiptSite=V;k.formatReceiptDateYMD=at;k.getReceiptExpWarningHtml=A;k.switchFnbReceiptSubView=ct;k.loadFnbReceipts=tn;k.onFnbPoSearchInput=en;k.loadFnbPoList=rt;k.renderFnbPoTable=Ht;k.openPoReceiptModal=ie;k.renderReceiptLinesTable=de;k.onReceiptLineQtyChange=nn;k.onReceiptLineBatchChange=on;k.onReceiptLineExpChange=an;k.setReceiptLineQuickExp=rn;k.onReceiptLineNoteChange=sn;k.closeCreateReceiptModal=le;k.openCreateReceiptModal=dn;k.submitCreateReceipt=ln;k.loadFnbReceiptsHistory=cn;k.viewReceiptDetail=un;k.openManualReceiptModal=pn;k.closeManualReceiptModal=ce;k.onManualReceiptSiteChange=gn;k.toggleManualShowAllCatalog=mn;k.loadManualCatalogItems=xt;k.filterManualCatalogList=lt;k.addManualReceiptItem=fn;k.renderManualReceiptLinesTable=ut;k.onManualLineQtyChange=hn;k.onManualLinePriceChange=bn;k.updateManualTotals=Nt;k.onManualLineBatchChange=yn;k.onManualLineExpChange=xn;k.setManualLineQuickExp=wn;k.onManualLineLocChange=vn;k.removeManualReceiptLine=ue;k.removeManualLine=ue;k.confirmClearAllManualReceiptLines=pe;k.clearAllManualReceiptLines=pe;k.closeConfirmClearManualLinesModal=ge;k.executeClearAllManualReceiptLines=kn;k.submitManualReceipt=Ln;function q(){let t=document.getElementById("globalBranchSelect")?.value,o=localStorage.getItem("orbit_user_site"),a=window,e=typeof a.App<"u"&&a.App.currentBranch?a.App.currentBranch.toUpperCase():null,n=document.getElementById("fnbWasteFilterSite")?.value,s=t||o||e||n||"K001";return(s==="ALL"||s==="all")&&(s="K001"),s.toUpperCase()}function me(){let t=document.getElementById("fnbWasteFilterSite");if(!t)return;let o=t.value||q(),a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(e=>e.code!=="ALL");if(a&&a.length){let e="";a.forEach(n=>{e+=`<option value="${n.code}" ${n.code.toUpperCase()===o.toUpperCase()?"selected":""}>${n.name}</option>`}),t.innerHTML=e,o&&Array.from(t.options).some(n=>n.value===o)&&(t.value=o)}}function pt(t){let o=document.getElementById("subtab-fnb-waste-stock"),a=document.getElementById("subtab-fnb-waste-history"),e=document.getElementById("fnbWasteSubViewStock"),n=document.getElementById("fnbWasteSubViewHistory");t==="history"?(o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),a&&(a.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),e&&e.classList.add("hidden"),n&&n.classList.remove("hidden")):(o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),a&&(a.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),e&&e.classList.remove("hidden"),n&&n.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function fe(t){let o=t||q(),a=document.getElementById("fnbWasteTableBody"),e=document.getElementById("fnbWasteMobileCards"),n=document.getElementById("fnbWasteBadgeHistoryCount");try{let r=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(o)}&no-cache=1`)).json();if(r.success&&r.data){let i=r.data.wastes||[];n&&(n.textContent=String(i.length)),a&&(i.length?a.innerHTML=i.map(l=>`
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
          `).join(""):a.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${b(o)}.</td></tr>`),e&&(i.length?e.innerHTML=i.map(l=>`
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
          `).join(""):e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(s){console.error("loadFnbWasteHistory error:",s)}}async function Sn(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let a=await(await fetch(`/api/fnb/wastes?id=${t}`)).json();if(!a.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let e=a.data.lines||[],n=document.getElementById("invDetailModal"),s=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");s&&(s.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${t}`),r&&(r.textContent=`${e.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let i=`
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
            ${e.map(d=>`
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
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=i),n&&n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(o){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+o.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function he(){let t=document.getElementById("fnbWasteNganhHangFilter"),o=document.getElementById("fnbWasteNhomHangFilter");if(!t||!o)return;let a=new Map;(window.gFnbWasteStockItems||[]).forEach(n=>{let s=(n.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),r=(n.nhom_hang||n.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();a.has(s)||a.set(s,new Set),a.get(s).add(r)}),window.gFnbWasteNganhMap=a;let e='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(a.keys()).sort().forEach(n=>{e+=`<option value="${b(n)}">${b(n)}</option>`}),t.innerHTML=e,t.value="",Ft("")}function Ft(t){let o=document.getElementById("fnbWasteNhomHangFilter");if(!o)return;let a=new Set;window.gFnbWasteNganhMap&&(t&&window.gFnbWasteNganhMap.has(t)?window.gFnbWasteNganhMap.get(t).forEach(n=>a.add(n)):window.gFnbWasteNganhMap.forEach(n=>n.forEach(s=>a.add(s))));let e='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(a).sort().forEach(n=>{e+=`<option value="${b(n)}">${b(n)}</option>`}),o.innerHTML=e,o.value=""}function Cn(){let t=document.getElementById("fnbWasteNganhHangFilter")?.value||"";Ft(t),gt()}function Tn(){gt()}function En(t){gt()}function In(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function gt(){let t=document.getElementById("fnbWasteStockTableBody"),o=document.getElementById("fnbWasteStockMobileCards"),a=document.getElementById("fnbWasteStockEmptyState"),e=document.getElementById("fnbWasteSummary"),n=document.getElementById("fnbWasteBadgeInStockCount"),s=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),r=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),i=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),l=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),d=window.gFnbWasteStockItems||[],c=document.getElementById("kpiWasteInStockCount"),u=document.getElementById("kpiWasteInStockVal");c&&(c.textContent=String(d.length));let m=0;if(d.forEach(p=>{m+=Number(p.total_value)||Number(p.book_qty)*Number(p.unit_price)||0}),u){let p=re(m);u.innerHTML=`${p.val}<span class="kpi-unit">${p.unit}</span>`}n&&(n.textContent=String(d.length));let f=d.filter(p=>{if(i==="EXP"&&(p.days_remaining!==void 0?Number(p.days_remaining):999)>15&&!p.is_expired||s&&(p.nganh_hang||"").trim().toLowerCase()!==s||r&&(p.nhom_hang||p.item_group||"").trim().toLowerCase()!==r)return!1;if(l){let h=(p.name||"").toLowerCase(),g=(p.code||"").toLowerCase();if(!h.includes(l)&&!g.includes(l))return!1}return!0});if(e&&(e.textContent=`Hi\u1EC3n th\u1ECB ${f.length} / ${d.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),Rt(),!f.length){t&&(t.innerHTML=""),o&&(o.innerHTML=""),a&&a.classList.remove("hidden");return}a&&a.classList.add("hidden");let y=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];t&&(t.innerHTML=f.map((p,h)=>{let g=Number(p.book_qty)||0,x=Number(p.unit_price)||0,w=Number(p.total_value)||g*x,v=p.wasteQty||0,C=v*x;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${h+1}</td>
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
            ${g.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(w).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${g}" value="${v>0?v:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${b(p.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${b(p.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${y.map(E=>`<option value="${b(E)}" ${p.wasteReason===E?"selected":""}>${b(E)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${b(p.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${C>0?Math.round(C).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${b(p.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${b(p.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=f.map(p=>{let h=Number(p.book_qty)||0,g=Number(p.unit_price)||0,x=p.wasteQty||0,w=x*g;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${b(p.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${b(p.name||p.code)}</h4>
              <div class="text-xs text-gray-400">${b(p.nganh_hang||p.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${h.toFixed(1)} ${b(p.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(g).toLocaleString("vi-VN")} \u20AB / ${b(p.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${h.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${h}" value="${x>0?x:""}" placeholder="0"
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
              ${y.map(v=>`<option value="${b(v)}" ${p.wasteReason===v?"selected":""}>${b(v)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function Mn(t,o){let a=(window.gFnbWasteStockItems||[]).find(l=>l.code===t);if(!a)return;let e=parseFloat(o),n=Number(a.book_qty)||0;isNaN(e)||e<0?a.wasteQty=0:e>n?(a.wasteQty=n,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${n})`)):a.wasteQty=e;let s=a.wasteQty*(Number(a.unit_price)||0),r=document.getElementById(`wasteLineTotal_${t}`);r&&(r.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let i=document.getElementById(`mobWasteLineTotal_${t}`);i&&(i.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),Rt()}function $n(t,o){let a=(window.gFnbWasteStockItems||[]).find(e=>e.code===t);a&&(a.wasteReason=o)}function _n(t,o){let a=(window.gFnbWasteStockItems||[]).find(e=>e.code===t);a&&(a.wasteNote=o)}function Rt(){let t=window.gFnbWasteStockItems||[],o=0,a=0;t.forEach(i=>{i.wasteQty>0&&(o++,a+=i.wasteQty*(Number(i.unit_price)||0))});let e=document.getElementById("kpiWasteSelectedCount");e&&(e.textContent=String(o));let n=document.getElementById("kpiWasteTotalEstAmount");if(n)if(a>0){let i=re(a);n.innerHTML=`${i.val}<span class="kpi-unit">${i.unit}</span>`}else n.textContent="0 \u20AB";let s=document.getElementById("btnSubmitDirectWaste"),r=document.getElementById("btnSubmitDirectWasteText");s&&(s.disabled=o===0),r&&(r.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${o})`)}async function Bn(){let o=(window.gFnbWasteStockItems||[]).filter(l=>(l.wasteQty||0)>0);if(!o.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let a=q(),e=new Date().toISOString().slice(0,10),n=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",s=0;o.forEach(l=>{s+=l.wasteQty*(Number(l.unit_price)||0)});let r={site_code:a,waste_date:e,reason:o.length===1?o[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:n,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${o.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:n,lines:o.map(l=>({item_code:l.code,qty:l.wasteQty,unit_price:Number(l.unit_price)||0,reason_detail:l.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:l.wasteNote||""}))},i=document.getElementById("btnSubmitDirectWaste");i&&(i.disabled=!0,i.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let d=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(!d.success)throw new Error(d.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${d.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${a} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),pt("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(l){console.error("submitDirectWaste error:",l),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+l.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),i&&(i.disabled=!1,i.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function Hn(){let t=document.getElementById("createWasteModal"),o=q(),a=document.getElementById("wasteModalSite"),e=document.getElementById("wasteModalDate");if(e&&!e.value&&(e.value=new Date().toISOString().slice(0,10)),a){let s="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(r=>{s+=`<option value="${r.code}" ${r.code===o?"selected":""}>${r.ten||r.name}</option>`}),a.innerHTML=s,a.value=o}await Dt(o);let n=document.getElementById("wasteLinesContainer");n&&(n.innerHTML=""),At(),t&&t.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function be(){let t=document.getElementById("createWasteModal");t&&t.classList.add("hidden")}async function Nn(){let t=document.getElementById("wasteModalSite")?.value||"K001";await Dt(t);let o=document.getElementById("wasteLinesContainer");o&&(o.innerHTML=""),At()}async function Dt(t){try{let a=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=a.success&&a.data?a.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function At(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let o=window.gWasteModalInStockItems||[],a="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),e='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';o.forEach(s=>{e+=`<option value="${b(s.code)}" data-price="${s.unit_price}" data-unit="${b(s.unit||"")}" data-stock="${s.book_qty}">[${b(s.code)}] ${b(s.name)} (T\u1ED3n: ${Number(s.book_qty).toFixed(1)} ${b(s.unit||"")})</option>`});let n=`
    <div id="${a}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${a}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${e}
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
  `;t.insertAdjacentHTML("beforeend",n),window.lucide&&window.lucide.createIcons()}function Fn(t,o){let a=document.getElementById(t);if(!a)return;let e=o.options[o.selectedIndex],n=Number(e?.getAttribute("data-price"))||0,s=Number(e?.getAttribute("data-stock"))||0,r=a.querySelector(".waste-modal-price");r&&(r.textContent=Math.round(n).toLocaleString("vi-VN")+" \u20AB");let i=a.querySelector(".waste-modal-qty");i&&(i.max=String(s),i.placeholder=`T\u1ED1i \u0111a ${s.toFixed(1)}`),ye(t,i?i.value:"0")}function ye(t,o){let a=document.getElementById(t);if(!a)return;let e=a.querySelector("select"),n=e?.options[e.selectedIndex],s=Number(n?.getAttribute("data-price"))||0,i=(parseFloat(o)||0)*s,l=a.querySelector(".waste-modal-amt");l&&(l.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),xe()}function xe(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let o=0;t.querySelectorAll(".p-3").forEach(e=>{let n=e.querySelector("select"),s=n?.options[n.selectedIndex],r=Number(s?.getAttribute("data-price"))||0,i=e.querySelector(".waste-modal-qty"),l=parseFloat(i?.value||"0")||0;o+=l*r});let a=document.getElementById("wasteModalTotalAmount");a&&(a.textContent=o>0?Math.round(o).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function Rn(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let o=[];if(t.querySelectorAll(".p-3").forEach(c=>{let u=c.querySelector("select"),m=u?.value,f=u?.options[u.selectedIndex],y=Number(f?.getAttribute("data-price"))||0,p=c.querySelector(".waste-modal-qty"),h=parseFloat(p?.value||"0")||0;m&&h>0&&o.push({item_code:m,qty:h,unit_price:y,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!o.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let a=document.getElementById("wasteModalSite")?.value||q(),e=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),n=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",s=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",r=document.getElementById("wasteModalNotes")?.value||"",i=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",l={site_code:a,waste_date:e,reason:n,confirmed_by:s,notes:r,created_by:i,lines:o},d=document.getElementById("btnSubmitWaste");d&&(d.disabled=!0,d.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let u=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)})).json();if(!u.success)throw new Error(u.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${u.data.waste_code}!`),be(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),pt("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(c){console.error("submitCreateWaste error:",c),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+c.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),d&&(d.disabled=!1,d.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function la(){me();let t=q(),o=document.getElementById("fnbWasteFilterSite");o&&o.value!==t&&(o.value=t);let a=document.getElementById("fnbWasteSummary");a&&(a.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+t+"...");try{let n=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();n.success&&n.data?window.gFnbWasteStockItems=(n.data.items||[]).map(s=>({...s,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],he(),gt(),fe(t)}catch(e){console.error("loadFnbWaste error:",e),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+e.message)}}var T=window;T.gFnbWasteStockItems=T.gFnbWasteStockItems||[];T.gFnbWasteNganhMap=T.gFnbWasteNganhMap||null;T.gWasteModalInStockItems=T.gWasteModalInStockItems||[];T.getActiveFnbWasteSite=q;T.populateFnbWasteSiteDropdown=me;T.loadFnbWaste=la;T.switchFnbWasteSubView=pt;T.populateFnbWasteFilters=he;T.populateFnbWasteNhomHangDropdown=Ft;T.onFnbWasteNganhHangChange=Cn;T.onFnbWasteFilterChange=Tn;T.onFnbWasteSearch=En;T.onFnbWasteSiteChange=In;T.renderFnbWasteStockTable=gt;T.onWasteLineQtyChange=Mn;T.onWasteLineReasonChange=$n;T.onWasteLineNoteChange=_n;T.updateWasteKPIs=Rt;T.submitDirectWaste=Bn;T.loadFnbWasteHistory=fe;T.viewWasteDetail=Sn;T.openCreateWasteModal=Hn;T.closeCreateWasteModal=be;T.onWasteModalSiteChange=Nn;T.loadWasteModalItems=Dt;T.addWasteLineRow=At;T.onWasteModalItemSelect=Fn;T.onWasteModalLineQtyInput=ye;T.recalculateWasteModalTotal=xe;T.submitCreateWaste=Rn;function Q(){let t=localStorage.getItem("orbit_user_site"),o=document.getElementById("globalBranchSelect")?.value,a=window,e=typeof a.App<"u"&&a.App.currentBranch?a.App.currentBranch.toUpperCase():null,n=document.getElementById("fnbCountSiteSelect")?.value,s=t||o||e||n||"K001";return(s==="ALL"||s==="all")&&(s="K001"),s.toUpperCase()}function Ot(){let t=document.getElementById("fnbCountNganhHangFilter"),o=document.getElementById("fnbCountNhomHangFilter");if(!t||!o)return;let a=new Map;(window.gFnbAllItems||[]).forEach(s=>{let r=(s.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),i=(s.nhom_hang||s.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();a.has(r)||a.set(r,new Set),a.get(r).add(i)}),window.gFnbNganhMap=a;let n='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(a.keys()).sort().forEach(s=>{n+=`<option value="${b(s)}">${b(s)}</option>`}),t.innerHTML=n,t.value="",Pt("")}function Pt(t){let o=document.getElementById("fnbCountNhomHangFilter");if(!o)return;let a=new Set;window.gFnbNganhMap&&(t&&window.gFnbNganhMap.has(t)?window.gFnbNganhMap.get(t).forEach(n=>a.add(n)):window.gFnbNganhMap.forEach(n=>n.forEach(s=>a.add(s))));let e='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(a).sort().forEach(n=>{e+=`<option value="${b(n)}">${b(n)}</option>`}),o.innerHTML=e,o.value=""}function Dn(){let t=document.getElementById("fnbCountNganhHangFilter")?.value||"";Pt(t),X()}function An(){X()}function On(t){X()}function Pn(){X()}function jn(){let t=document.getElementById("fnbCountSiteSelect");if(t&&t.value&&t.value!=="all"){try{localStorage.setItem("orbit_user_site",t.value)}catch{}let o=document.getElementById("globalBranchSelect");o&&(o.value=t.value)}typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}function Wn(t){window.gFnbBlindCount=t,X()}function Vn(t,o){let a=(window.gCurrentCountItems||[]).find(e=>e.code===t);a&&(a.userCount=o===""?0:Number(o),X())}function qn(t,o){let a=(window.gCurrentCountItems||[]).find(e=>e.code===t);a&&(a.userNote=o)}function X(){let t=document.getElementById("fnbCountsTableBody"),o=document.getElementById("fnbCountsMobileCards"),a=(document.getElementById("fnbCountNganhHangFilter")?.value||"").trim().toLowerCase(),e=(document.getElementById("fnbCountNhomHangFilter")?.value||"").trim().toLowerCase(),n=document.getElementById("fnbCountStatusFilter")?.value||"all",s=(document.getElementById("fnbCountSearchInput")?.value||"").trim().toLowerCase(),r=window.gFnbAllItems||[],i=r.filter(p=>{if(a&&(p.nganh_hang||"").trim().toLowerCase()!==a||e&&(p.nhom_hang||p.item_group||"").trim().toLowerCase()!==e)return!1;if(n!=="all"){let h=Number(p.book_qty)||0,x=(p.userCount!==void 0?Number(p.userCount):p.last_count_qty!==null&&p.last_count_qty!==void 0?Number(p.last_count_qty):h)-h,w=p.userCount!==void 0||p.last_count_qty!==null;if(n==="diff"&&Math.abs(x)<.001||n==="matched"&&Math.abs(x)>=.001||n==="counted"&&!w||n==="uncounted"&&w)return!1}if(s){let h=(p.name||"").toLowerCase(),g=(p.code||"").toLowerCase(),x=(p.nganh_hang||"").toLowerCase(),w=(p.nhom_hang||"").toLowerCase();if(!h.includes(s)&&!g.includes(s)&&!x.includes(s)&&!w.includes(s))return!1}return!0});window.gCurrentCountItems=i;let l=0,d=0,c=0;i.forEach(p=>{let h=Number(p.book_qty)||0,g=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:h,w=(Number(g)||0)-h,v=w*(Number(p.unit_price)||0);Math.abs(w)<.001?l++:d++,c+=v});let u=document.getElementById("fnbCountMetricTotal");u&&(u.textContent=String(i.length));let m=document.getElementById("fnbCountMetricMatched");m&&(m.textContent=String(l));let f=document.getElementById("fnbCountMetricDiff");f&&(f.textContent=String(d));let y=document.getElementById("fnbCountMetricDiffVal");y&&(y.textContent=(c>0?"+":"")+Math.round(c).toLocaleString("vi-VN")+" \u0111"),t&&(i.length===0?!r||r.length===0?t.innerHTML=`<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
            <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nh\u1EADp H\xE0ng \u0110i\u1EC3m B\xE1n</a> tr\u01B0\u1EDBc khi th\u1EF1c hi\u1EC7n ki\u1EC3m k\xEA.</p>
          </div>
        </td></tr>`:t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>':t.innerHTML=i.map((p,h)=>{let g=Number(p.book_qty)||0,x=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:g,w=Number(x)||0,v=w-g,C=v*(Number(p.unit_price)||0),E='<span class="text-gray-400 tabular-nums">0</span>';v>0?E=`<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${v.toFixed(1)}</span>`:v<0&&(E=`<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${v.toFixed(1)}</span>`);let _='<span class="text-gray-400 tabular-nums font-mono">0 \u0111</span>';C>0?_=`<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(C).toLocaleString("vi-VN")} \u0111</span>`:C<0&&(_=`<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(C).toLocaleString("vi-VN")} \u0111</span>`);let W=window.gFnbBlindCount?'<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">\u2022\u2022\u2022\u2022</span>':`<span class="font-bold tabular-nums font-mono ${g<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${g.toFixed(1)}</span>`,F=p.nhom_hang||p.item_group||"";return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${h+1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${b(p.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${b(p.code)}</span>
                ${F?`<span>\u2022</span><span class="text-gray-500 dark:text-gray-400">${b(F)}</span>`:""}
                <span>\u2022</span>
                <span class="font-mono">Gi\xE1: ${Number(p.unit_price).toLocaleString("vi-VN")} \u0111</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${b(p.unit||"")}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${W}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${w}" oninput="onCountInputChange('${b(p.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${E}</td>
            <td class="py-3 px-3 text-right select-all">${_}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="L\xFD do ch\xEAnh l\u1EC7ch (n\u1EBFu c\xF3)..." value="${b(p.userNote||"")}" oninput="onCountNoteChange('${b(p.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `}).join("")),o&&(i.length===0?!r||r.length===0?o.innerHTML=`<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
          <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nh\u1EADp H\xE0ng</a> tr\u01B0\u1EDBc khi ki\u1EC3m k\xEA.</p>
        </div>`:o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':o.innerHTML=i.map(p=>{let h=Number(p.book_qty)||0,g=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:h,x=Number(g)||0,w=x-h,v=w*(Number(p.unit_price)||0);return`
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${b(p.nhom_hang||p.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${b(p.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${b(p.code)}</span> \u2022 ${Number(p.unit_price).toLocaleString("vi-VN")} \u0111/${b(p.unit||"")}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">T\u1ED3n s\xE1ch:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${h<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${window.gFnbBlindCount?"\u2022\u2022\u2022\u2022":h.toFixed(1)} ${b(p.unit||"")}</div>
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
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function Xn(){let t=Q(),o=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),a="DAILY",e=window.gCurrentCountItems||[];if(!e||!e.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 l\u01B0u ki\u1EC3m k\xEA!");return}let n=e.map(r=>{let i=Number(r.book_qty)||0,l=r.userCount!==void 0?Number(r.userCount):r.last_count_qty!==null&&r.last_count_qty!==void 0?Number(r.last_count_qty):i,d=l-i,c=d*(Number(r.unit_price)||0);return{item_code:r.code,item_name:r.name,item_group:r.item_group||r.nhom_hang||"NVL",unit:r.unit,unit_price:Number(r.unit_price)||0,book_qty:i,actual_qty:l,count_qty:l,diff_qty:d,diff_value:c,diff_val:c,note:r.userNote||""}}),s={site_code:t,count_date:o,count_type:a,notes:`Ki\u1EC3m k\xEA h\u1EB1ng ng\xE0y \u0111i\u1EC3m ${t}`,lines:n};try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA...");let i=await(await fetch("/api/fnb/counts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();if(!i.success)throw new Error(i.error||"L\u1ED7i khi l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA");typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA ${i.data.count_code} th\xE0nh c\xF4ng!`),typeof window.loadFnbCounts=="function"&&await window.loadFnbCounts()}catch(r){console.error("saveFnbCountAudit error:",r),typeof window.showToast=="function"&&window.showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+r.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function we(t){let o=t||Q();try{let e=await(await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(o)}`)).json(),n=document.getElementById("fnbCountsHistoryBody"),s=document.getElementById("fnbCountsHistoryMobileCards");if((n||s)&&e.success){let r=e.data.counts||[];r.length?(n&&(n.innerHTML=r.map(i=>`
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
          `).join(""))):(n&&(n.innerHTML=`<tr><td colspan="8" class="text-center py-6 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${b(o)}.</td></tr>`),s&&(s.innerHTML=`<div class="card p-6 text-center text-gray-400 text-sm">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${b(o)}.</div>`))}}catch(a){console.error("loadFnbCountsHistory error:",a)}}async function Kn(t){try{typeof window.showLoading=="function"&&window.showLoading();let a=await(await fetch(`/api/fnb/counts?id=${t}`)).json();if(!a.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu");let e=a.data.lines||[],n=document.getElementById("invDetailModal"),s=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");s&&(s.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Ki\u1EC3m K\xEA #${t}`),r&&(r.textContent=`${e.length} m\u1EB7t h\xE0ng ki\u1EC3m k\xEA`);let i=`
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
            ${e.map(d=>`
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
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=i),n&&n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(o){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+o.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Un(){document.getElementById("invDetailModal")?.classList.add("hidden")}function Gn(){let t=window.gCurrentCountItems||[];if(!t||!t.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t phi\u1EBFu ki\u1EC3m!");return}let o=Q(),a=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),n=[["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)","T\u1ED3n S\u1ED5 S\xE1ch","S\u1ED1 \u0110\u1EBFm Th\u1EF1c T\u1EBF","Ch\xEAnh L\u1EC7ch","Ghi Ch\xFA"]];if(t.forEach((l,d)=>{let c=Number(l.book_qty)||0,u=l.userCount!==void 0?Number(l.userCount):l.last_count_qty!==null&&l.last_count_qty!==void 0?Number(l.last_count_qty):c,m=u-c;n.push([d+1,l.code,l.name,l.nganh_hang||"",l.nhom_hang||l.item_group||"",l.unit,Number(l.unit_price)||0,c,u,m,l.userNote||""])}),typeof XLSX>"u"){typeof window.showToast=="function"&&window.showToast("Th\u01B0 vi\u1EC7n XLSX ch\u01B0a s\u1EB5n s\xE0ng!");return}let s=XLSX.utils.aoa_to_sheet(n);s["!cols"]=[{wch:6},{wch:15},{wch:32},{wch:20},{wch:22},{wch:8},{wch:14},{wch:14},{wch:16},{wch:14},{wch:25}],s["!autofilter"]={ref:`A1:K${n.length}`},s["!views"]=[{state:"frozen",ySplit:1,xSplit:0}];let r=XLSX.utils.decode_range(s["!ref"]||"A1:K1");for(let l=r.s.r;l<=r.e.r;++l)for(let d=r.s.c;d<=r.e.c;++d){let c=XLSX.utils.encode_cell({r:l,c:d});if(s[c])if(l===0)s[c].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:d===0||d===1?"center":d>=6&&d<=9?"right":"left",wrapText:!1}};else{let u=d===0||d>=6&&d<=9,m=d===1||d===5;s[c].s={font:{name:"Aptos",sz:11,regular:!0,color:{rgb:"000000"}},alignment:{vertical:"center",horizontal:u?"right":m?"center":"left"}}}}let i=XLSX.utils.book_new();XLSX.utils.book_append_sheet(i,s,"PhieuKiemKe"),XLSX.writeFile(i,`Phieu_Kiem_Ke_${o}_${a}.xlsx`),typeof window.showToast=="function"&&window.showToast("\u0110\xE3 xu\u1EA5t phi\u1EBFu ki\u1EC3m k\xEA Excel theo quy chu\u1EA9n Aptos!")}async function ca(){let t=Q(),o=document.getElementById("fnbCountSiteSelect");o&&o.value!==t&&(o.value=t);let e=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(i=>i.code.toUpperCase()===t.toUpperCase()),n=e?e.ten||e.name:t,s=document.getElementById("fnbCountCurrentSiteBadge");s&&(s.textContent=n);let r=document.getElementById("fnbCountDatePicker");r&&!r.value&&(r.value=new Date().toISOString().slice(0,10));try{typeof window.showLoading=="function"&&window.showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA c\u1EE7a "+t+"...");let l=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();l.success&&l.data?(window.gFnbAllItems=l.data.items||[],Ot(),X()):(window.gFnbAllItems=[],Ot(),X()),we(t)}catch(i){console.error("loadFnbCounts error:",i),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u ki\u1EC3m k\xEA: "+i.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}var M=window;M.gFnbAllItems=M.gFnbAllItems||[];M.gCurrentCountItems=M.gCurrentCountItems||[];M.gFnbBlindCount=M.gFnbBlindCount||!1;M.gFnbNganhMap=M.gFnbNganhMap||null;M.getActiveFnbCountSite=Q;M.loadFnbCounts=ca;M.populateFnbCountFilters=Ot;M.populateFnbCountNhomHangDropdown=Pt;M.onFnbCountNganhHangChange=Dn;M.onFnbCountFilterChange=An;M.onFnbCountSearch=On;M.onFnbCountDateChange=Pn;M.onFnbCountSiteChange=jn;M.toggleBlindCount=Wn;M.onCountInputChange=Vn;M.onCountNoteChange=qn;M.renderFnbCountsTable=X;M.saveFnbCountAudit=Xn;M.loadFnbCountsHistory=we;M.viewCountDetail=Kn;M.closeInvDetailModal=Un;M.exportCountSheetExcel=Gn;function jt(t){if(!t||!t.rows||t.rows.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}try{let o=t.sites||[],a=t.rows||[],e=t.groups||{},n=["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)"];o.forEach(u=>{n.push(u.ten||u.name||u.code)});let s=[n];a.forEach((u,m)=>{let f=e[u.group]||u.group,y=[m+1,u.code,u.name,f,u.unit,u.price||0];o.forEach(p=>{let h=u.cells?u.cells[p.id]:void 0;y.push(h&&h.book||0)}),s.push(y)});let r=XLSX.utils.aoa_to_sheet(s),i=XLSX.utils.decode_range(r["!ref"]),l=[{wch:6},{wch:14},{wch:32},{wch:18},{wch:8},{wch:14}];o.forEach(()=>l.push({wch:16})),r["!cols"]=l;for(let u=i.s.r;u<=i.e.r;++u)for(let m=i.s.c;m<=i.e.c;++m){let f=XLSX.utils.encode_cell({r:u,c:m});if(!r[f])continue;if(u===0)r[f].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"CCCCCC"}},bottom:{style:"medium",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"CCCCCC"}},right:{style:"thin",color:{rgb:"CCCCCC"}}}};else{let p="left",h;m===0||m===1||m===4?p="center":(m===5||m>=6)&&(p="right",h="#,##0.00");let g=m>=6&&typeof r[f].v=="number"&&r[f].v<0;r[f].s={font:{name:"Aptos",sz:11,bold:g,color:{rgb:g?"C00000":"000000"}},alignment:{horizontal:p,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E5E5E5"}},bottom:{style:"thin",color:{rgb:"E5E5E5"}},left:{style:"thin",color:{rgb:"E5E5E5"}},right:{style:"thin",color:{rgb:"E5E5E5"}}}},h&&typeof r[f].v=="number"&&(r[f].z=h)}}r["!autofilter"]={ref:r["!ref"]},r["!freeze"]={xSplit:3,ySplit:1,topLeftCell:"D2",activePane:"bottomRight",state:"frozen"};let d=XLSX.utils.book_new();XLSX.utils.book_append_sheet(d,r,"T\u1ED3n Kho Chu\u1ED7i F&B");let c=new Date().toISOString().slice(0,10).replace(/-/g,"");XLSX.writeFile(d,`Ton_Kho_F&B_Chuoi_${c}.xlsx`),typeof showToast=="function"&&showToast("Xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho F&B th\xE0nh c\xF4ng (Font Aptos)!")}catch(o){console.error("Export Excel error:",o),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+(o?.message||o))}}var K=null,H={site:"ALL",group:"ALL",search:"",showValue:!1},Wt="";async function ve(){try{typeof showLoading=="function"&&showLoading();let t=new URL("/api/fnb/stock",window.location.origin);H.site&&H.site!=="ALL"&&H.site!=="all"&&t.searchParams.set("site_code",H.site),H.region&&H.region!=="ALL"&&t.searchParams.set("regionId",H.region),H.group&&H.group!=="ALL"&&t.searchParams.set("group",H.group),t.searchParams.set("refresh","true");let a=await(await fetch(t.toString())).json();if(!a.success||!a.data)throw new Error(a.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c d\u1EEF li\u1EC7u t\u1ED3n kho F&B");K=a.data,window.gFnbStockData=K,wt()}catch(t){console.error("Error loadFnbStock:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i t\u1ED3n kho F&B: "+(t?.message||t))}finally{typeof hideLoading=="function"&&hideLoading()}}function wt(){if(!K)return;let t=K.sites||[],o=K.rows||[],a=K.groups||{},e=(Wt||"").trim().toLowerCase(),n=o.filter(g=>{if(!e)return!0;let x=(g.name||"").toLowerCase().includes(e),w=(g.code||"").toLowerCase().includes(e);return x||w}),s=H.site,r=n;s&&s!=="ALL"&&s!=="all"&&(r=n.filter(g=>{let x=g.cells&&g.cells[s];return x&&(x.hasSiteRecord||x.book!==void 0&&Number(x.book)!==0||x.lastCount!==null&&x.lastCount!==void 0)}));let i=0,l=0,d=0;n.forEach(g=>{t.forEach(x=>{let w=g.cells&&g.cells[x.id];if(w){let v=Number(w.value)||0,C=Number(w.book)||0;i+=v,C<0&&l++,w.noOpening&&d++}})});let c=document.getElementById("fnbStockKpiTotalItems"),u=document.getElementById("fnbStockKpiTotalValue"),m=document.getElementById("fnbStockKpiNegative"),f=document.getElementById("fnbStockKpiNoOpening");c&&(c.textContent=r.length.toLocaleString("vi-VN")),u&&(u.textContent=Math.round(i).toLocaleString("vi-VN")+" \u0111"),m&&(m.textContent=l.toLocaleString("vi-VN")),f&&(f.textContent=d.toLocaleString("vi-VN"));let y=document.getElementById("fnbStockTableHead");if(y){let g=`
      <tr>
        <th class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">STT</th>
        <th class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-white/3 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">M\u1EB7t H\xE0ng F&amp;B</th>
        <th class="py-3 px-3 text-center w-16 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">\u0110VT</th>
    `;t.forEach(x=>{let w=x.region==="Mi\u1EC1n Nam";g+=`
        <th class="py-3 px-3 text-right font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 min-w-[125px]">
          <div class="flex items-center justify-end gap-1.5">
            <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${w?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${w?"MN":"MB"}</span>
            <span title="${x.name}" class="text-gray-800 dark:text-gray-200">${x.code}</span>
          </div>
          <div class="text-xs font-normal text-gray-400 truncate max-w-[115px]" title="${x.name}">${x.name}</div>
        </th>
      `}),g+="</tr>",y.innerHTML=g}let p=document.getElementById("fnbStockTableBody");p&&(r.length===0?p.innerHTML=`<tr><td colspan="${t.length+3}" class="text-center py-12 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>`:p.innerHTML=r.map((g,x)=>{let w=a[g.group]||g.group,v=`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${x+1}</td>
            <td class="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-white/3 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${w}</span>
                <span class="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">${g.name}</span>
              </div>
              <div class="text-xs tabular-nums text-gray-400 mt-0.5 flex items-center gap-2">
                <span>${g.code}</span>
                <span>\u2022</span>
                <span>Gi\xE1: ${g.price?Number(g.price).toLocaleString("vi-VN")+" \u0111":"--"}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-medium text-gray-600 dark:text-gray-300 text-xs">${g.unit}</td>
        `;return t.forEach(C=>{let E=g.cells&&g.cells[C.id]||{book:0,lastCount:null,noOpening:!0,value:0},_=Number(E.book)||0,F=_<0?"text-rose-600 dark:text-rose-400 font-semibold":_>0?"text-gray-900 dark:text-white font-bold":"text-gray-400 dark:text-gray-600 font-medium",yt="";if(E.lastCount!==null&&E.lastCount!==void 0&&E.lastCount!==""){let Bt=Number(E.lastCount);if(!isNaN(Bt)){let Ze=Number.isInteger(Bt)?Bt.toLocaleString("vi-VN"):Bt.toFixed(1);yt=` <span class="text-gray-400 dark:text-gray-500 font-normal text-xs" title="\u0110\u1EBFm g\u1EA7n nh\u1EA5t (${E.lastDate||"N/A"}): ${Ze}">(${Ze})</span>`}}let dt="";E.noOpening&&(dt='<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" title="Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u"></span>');let ae="",Ye=Number(E.value)||0;H.showValue&&Ye&&(ae=`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums mt-0.5">${Math.round(Ye).toLocaleString("vi-VN")} \u0111</div>`);let da=Number.isInteger(_)?_.toLocaleString("vi-VN"):_.toFixed(1);v+=`
            <td class="py-3 px-3 text-right tabular-nums text-xs select-all">
              <div class="flex items-center justify-end">
                ${dt}
                <span class="${F}">${da}</span>${yt}
              </div>
              ${ae}
            </td>
          `}),v+="</tr>",v}).join(""));let h=document.getElementById("fnbStockMobileCards");h&&(r.length===0?h.innerHTML='<div class="text-center py-10 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':h.innerHTML=n.map(g=>{let x=a[g.group]||g.group,w=t.map(v=>{let C=g.cells&&g.cells[v.id]||{book:0,lastCount:null,noOpening:!0,value:0},E=Number(C.book)||0,_=E<0,W=E===0,F=Number.isInteger(E)?E.toLocaleString("vi-VN"):E.toFixed(1),yt="";if(C.lastCount!==null&&C.lastCount!==void 0&&C.lastCount!==""){let dt=Number(C.lastCount);isNaN(dt)||(yt=`(${Number.isInteger(dt)?dt.toLocaleString("vi-VN"):dt.toFixed(1)})`)}return{site:v,cell:C,isNeg:_,isZero:W,bookFormatted:F,countText:yt}});return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${x}</span>
                  <span class="text-xs tabular-nums text-gray-400 font-bold">${g.code}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">${g.name}</h4>
              </div>
              <div class="text-right shrink-0">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold tabular-nums">${g.unit}</span>
                <div class="text-xs text-gray-400 tabular-nums mt-1">${g.price?Number(g.price).toLocaleString("vi-VN")+" \u0111":""}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              ${w.map(v=>{let C=v.site.region==="Mi\u1EC1n Nam";return`
                  <div class="p-2.5 rounded-xl ${v.isNeg?"bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40":v.isZero?"bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/60":"bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60"}">
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${v.site.code}</span>
                      <span class="text-[8.5px] px-1 rounded font-semibold ${C?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${C?"MN":"MB"}</span>
                    </div>
                    <div class="flex items-baseline justify-between tabular-nums">
                      <span class="text-xs text-gray-400">T\u1ED3n:</span>
                      <span class="${v.isNeg?"text-rose-600 dark:text-rose-400 font-semibold text-sm":v.isZero?"text-gray-400 font-medium":"text-gray-900 dark:text-white font-bold text-sm"}">${v.bookFormatted} <span class="text-xs text-gray-400 font-normal">${v.countText}</span></span>
                    </div>
                    ${v.cell.noOpening?'<div class="text-xs text-amber-500 font-semibold mt-0.5">\u26A0\uFE0F Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u</div>':""}
                    ${H.showValue&&v.cell.value?`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums text-right mt-0.5">${Math.round(v.cell.value).toLocaleString("vi-VN")} \u0111</div>`:""}
                  </div>
                `}).join("")}
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Qn(){let t=document.getElementById("fnbStockFilterRegion"),o=document.getElementById("fnbStockFilterGroup"),a=document.getElementById("fnbStockFilterSite");a&&(H.site=a.value),t&&(H.region=t.value),o&&(H.group=o.value),ve()}function zn(t){Wt=t,wt()}function Jn(t){H.showValue=t,wt()}function Ar(){jt(K)}var U=window;U.gFnbStockData=K;U.gFnbStockFilter=H;U.gFnbStockSearchTerm=Wt;U.loadFnbStock=ve;U.renderFnbStock=wt;U.onFnbStockFilterChange=Qn;U.onFnbStockSearch=zn;U.onFnbStockToggleValue=Jn;U.exportFnbStockExcel=()=>jt(U.gFnbStockData||K);function ke(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function Le(t,o){return typeof window.cellBadge=="function"?window.cellBadge(t,o):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${o}</span>`}function Se(t){if(typeof window.escapeHtml=="function")return window.escapeHtml(t);let o=document.createElement("div");return o.textContent=t||"",o.innerHTML}function B(t){return typeof window.fmtVND=="function"?window.fmtVND(t):S(Number(t)||0)}function Ce(t){return typeof window.fmtNum=="function"?window.fmtNum(t):L(Number(t)||0)}function z(){let t=window;return t.App||(t.App={}),t.App.items||(t.App.items=[]),t.App.items}function Vt(t){let o=window;o.App||(o.App={}),o.App.items=t}function vt(){let t=document.getElementById("dinhMucBody"),o=document.getElementById("orderMobileCards"),a=(document.getElementById("orderSearch")?.value||"").toLowerCase(),e=document.getElementById("fLoai")?.value||"",n=document.getElementById("fChiNhap")?.checked,s=document.getElementById("orderSupplyChannel")?.value||"ALL",i=z().filter(d=>{if(a&&!d.maHang.toLowerCase().includes(a)&&!d.tenSP.toLowerCase().includes(a)||e&&d.tenLoai!==e||n&&(!d.soLuongDat||d.soLuongDat<=0))return!1;if(s==="BTT"){let c=((d.nguonCung||"")+" "+(d.tenLoai||"")+" "+(d.tenSP||"")).toLowerCase();if(!c.includes("btt")&&!c.includes("trung t\xE2m")&&!c.includes("ch\u1EBF bi\u1EBFn"))return!1}else if(s==="NCC"){let c=((d.nguonCung||"")+" "+(d.tenLoai||"")).toLowerCase();if(c.includes("btt")||c.includes("trung t\xE2m"))return!1}else if(s==="URGENT"){let c=((d.nganh_hang||"")+" "+(d.tenLoai||"")+" "+(d.tenSP||"")).toLowerCase();if(!c.includes("t\u01B0\u01A1i")&&!c.includes("th\u1ECBt")&&!c.includes("rau")&&!c.includes("kh\u1EA9n"))return!1}return!0});if(!i.length){t&&(t.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</div>');return}let l=window.innerWidth>=1024;t&&(l?t.innerHTML=i.map(d=>{let c=d.soLuongDat||"",u=(d.soLuongDat||0)*(d.donGia||0);return`
          <tr>
            <td class="col-code">${ke(d.maHang)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white">${d.tenSP}</span></td>
            <td>${Le("neutral",d.tenLoai||"CCDC")}</td>
            <td>${d.dvt||"C\xE1i"}</td>
            <td class="col-num"><span class="num">${B(d.donGia)}</span></td>
            <td class="col-num"><span class="num">${Ce(d.daDat)}</span></td>
            <td class="col-num text-right">
              <input type="number" min="0" value="${c}" placeholder="0" class="input h-8 w-24 text-right num"
                oninput="onQtyChange('${d.maHang}', this.value)">
            </td>
            <td class="col-num font-semibold text-brand-600 dark:text-brand-400" id="subtotal-${d.maHang}">${B(u)}</td>
          </tr>
        `}).join(""):t.innerHTML=""),o&&(l?o.innerHTML="":o.innerHTML=i.map(d=>{let c=d.soLuongDat||"",u=(d.soLuongDat||0)*(d.donGia||0);return`
          <div class="data-card space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  ${ke(d.maHang)}
                  ${Le("neutral",d.tenLoai||"CCDC")}
                  <span class="text-xs text-gray-500">\u0110VT: ${d.dvt||"C\xE1i"}</span>
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${d.tenSP}</h4>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <div>
                <span class="text-xs text-gray-400">\u0110\u01A1n gi\xE1:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${B(d.donGia)}</div>
              </div>
              <div>
                <span class="text-xs text-gray-400">\u0110\xE3 \u0111\u1EB7t l\u0169y k\u1EBF:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${Ce(d.daDat)}</div>
              </div>
              <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <div class="flex-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">S\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t:</label>
                  <input type="number" min="0" value="${c}" placeholder="0" class="input h-10 w-full text-center num text-sm font-semibold"
                    oninput="onQtyChange('${d.maHang}', this.value)">
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-400">Th\xE0nh ti\u1EC1n:</span>
                  <div class="text-base font-semibold text-brand-600 dark:text-brand-400 num" id="mob-subtotal-${d.maHang}">${B(u)}</div>
                </div>
              </div>
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Yn(){vt()}function Zn(t,o){let e=z().find(n=>n.maHang===t);if(e){e.soLuongDat=Number(o)||0;let n=document.getElementById(`subtotal-${t}`);n&&(n.textContent=B(e.soLuongDat*(e.donGia||0)));let s=document.getElementById(`mob-subtotal-${t}`);s&&(s.textContent=B(e.soLuongDat*(e.donGia||0))),document.querySelectorAll(`input[oninput*="'${t}'"]`).forEach(r=>{r.value!==o&&(r.value=o)})}kt()}function kt(t,o){let a=document.getElementById("kpiNganSach"),e=document.getElementById("kpiDaDat"),n=t!==void 0?Number(t):Number(a?.dataset?.raw)||Number((a?.textContent||"").replace(/[^\d]/g,""))||0,s=o!==void 0?Number(o):Number(e?.dataset?.raw)||Number((e?.textContent||"").replace(/[^\d]/g,""))||0,i=z().reduce((w,v)=>w+(v.soLuongDat||0)*(v.donGia||0),0),l=s+i,d=n-l,c=n>0?Math.round(l/n*100):0,u=document.getElementById("kpiConLai");u&&(u.dataset.raw=String(d),u.textContent=B(d),u.title=B(d),d<0?(u.classList.remove("text-gray-900","dark:text-white"),u.classList.add("text-rose-600","dark:text-rose-400")):(u.classList.remove("text-rose-600","dark:text-rose-400"),u.classList.add("text-gray-900","dark:text-white")));let m=document.getElementById("kpiDangNhapSub");m&&(m.textContent="\u0110ang nh\u1EADp: "+B(i));let f=document.getElementById("kpiConLaiDelta");f&&(d<0?(f.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",f.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>\xC2m h\u1EA1n m\u1EE9c</span>'):(f.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",f.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>Kh\u1EA3 d\u1EE5ng</span>'));let y=document.getElementById("kpiTyLe");y&&(y.textContent=c+"%",c>100?y.className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums tracking-tight num":c>80?y.className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums tracking-tight num":y.className="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-white tabular-nums tracking-tight num");let p=document.getElementById("budUsed");p&&(p.textContent=B(l));let h=document.getElementById("budFill"),g=document.getElementById("budBadge"),x=document.getElementById("budNote");h&&(h.style.width=Math.min(c,100)+"%",c>100?(h.className="h-full rounded-full bg-rose-500 transition-all duration-300",g&&(g.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",g.innerHTML=`<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>V\u01B0\u1EE3t ${c-100}%</span>`),x&&(x.innerHTML=`<span class="text-rose-600 dark:text-rose-400 font-semibold">\u26A0\uFE0F V\u01B0\u1EE3t \u0111\u1ECBnh m\u1EE9c ${c-100}%! C\u1EA7n gi\u1EA3i tr\xECnh.</span>`)):c>80?(h.className="h-full rounded-full bg-amber-500 transition-all duration-300",g&&(g.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50",g.innerHTML="<span>G\u1EA7n ch\u1EA1m tr\u1EA7n</span>"),x&&(x.textContent=`\u0110\xE3 d\xF9ng ${c}% ng\xE2n s\xE1ch. G\u1EA7n ch\u1EA1m m\u1EE9c gi\u1EDBi h\u1EA1n.`)):(h.className="h-full rounded-full bg-indigo-500 transition-all duration-300",g&&(g.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",g.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>An to\xE0n</span>'),x&&(x.textContent=`Ng\xE2n s\xE1ch an to\xE0n (${c}%).`)))}async function Te(){let t=window,o=localStorage.getItem("orbit_user_site")||t.gCurrentUser&&t.gCurrentUser.assignedSite||"K001",e=((typeof getAppSitesList=="function"?getAppSitesList():[])||t.App&&t.App.siteObjs||[]).find(d=>(d.code||"").toLowerCase()===o.toLowerCase()),n=e?e.ten||e.name:document.getElementById("orderSite")?.value||o,s=document.getElementById("orderSite");if(s&&(s.innerHTML=`<option value="${n}">${n}</option>`,s.value=n),!n)return;let r=document.getElementById("globalMonthPicker")?.value,i=document.getElementById("orderMonth")?.value;if(!i||r&&i!==r){i=r||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;let d=document.getElementById("orderMonth");d&&(d.value=i)}let l="";if(i){let d=i.split("-");l=`${d[1]}/${d[0]}`}typeof showLoading=="function"&&showLoading("T\u1EA3i danh s\xE1ch v\u1EADt t\u01B0 theo Site...");try{let c=await(await fetch(`/api/quota?site=${encodeURIComponent(n)}&thang=${encodeURIComponent(l)}&refresh=true`)).json();if(c.success){Vt(c.data.items||[]);let u=document.getElementById("kpiNganSach");u&&(u.dataset.raw=String(c.data.nganSach),u.textContent=B(c.data.nganSach),u.title=B(c.data.nganSach));let m=document.getElementById("kpiSubSite");m&&(m.textContent=c.data.site||n,m.title=c.data.site||n);let f=document.getElementById("kpiDaDat");f&&(f.dataset.raw=String(c.data.tienDaDat),f.textContent=B(c.data.tienDaDat),f.title=B(c.data.tienDaDat));let y=document.getElementById("budTotal");y&&(y.textContent=B(c.data.nganSach));let p=z(),h=Array.from(new Set(p.map(x=>x.tenLoai).filter(Boolean))),g=document.getElementById("fLoai");g&&(g.innerHTML='<option value="">T\u1EA5t c\u1EA3 lo\u1EA1i NVL</option>'+h.map(x=>`<option value="${x}">${x}</option>`).join("")),vt(),kt(c.data.nganSach,c.data.tienDaDat),t.lucide&&t.lucide.createIcons&&t.lucide.createIcons()}else typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i \u0111\u1ECBnh m\u1EE9c: "+(c.error||""))}catch(d){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+(d?.message||d))}finally{typeof hideLoading=="function"&&hideLoading()}}function to(){let o=z().filter(r=>(r.soLuongDat||0)>0);if(!o.length){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng cho \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng.");return}let a=document.getElementById("orderSite")?.value||"",e=document.getElementById("orderMonth")?.value||"",n=o.reduce((r,i)=>r+(i.soLuongDat||0)*(i.donGia||0),0),s=`
    <div class="space-y-3">
      <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
        <div>Site \u0111\u1EB7t: <b>${a}</b></div>
        <div>Th\xE1ng: <b>${e}</b></div>
        <div>T\u1ED5ng ti\u1EC1n \u0111\u01A1n: <b class="text-brand-700 tabular-nums text-sm">${B(n)}</b></div>
      </div>
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto max-h-56 rounded-xl border border-gray-200 dark:border-gray-800">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
          <tbody>
            ${o.map(r=>`
              <tr><td class="p-2 tabular-nums">${r.maHang}</td><td class="p-2">${r.tenSP}</td><td class="p-2 text-right tabular-nums font-bold">${r.soLuongDat}</td><td class="p-2 text-right tabular-nums">${B((r.soLuongDat||0)*r.donGia)}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <!-- Mobile Order Items Cards -->
      <div class="block sm:hidden space-y-2 max-h-56 overflow-y-auto">
        ${o.map(r=>`
          <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
            <div class="min-w-0">
              <div class="font-bold text-gray-900 dark:text-white truncate">${Se(r.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${Se(r.maHang)}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${r.soLuongDat}</div>
              <div class="num text-[11px] text-gray-500">${B((r.soLuongDat||0)*r.donGia)}</div>
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
  `;typeof openGeneralModal=="function"&&openGeneralModal("X\xE1c nh\u1EADn \u0111\u1EB7t h\xE0ng v\u1EADt t\u01B0",s)}async function eo(){let t=window,o=z(),a=o.filter(i=>(i.soLuongDat||0)>0),e=document.getElementById("orderSite")?.value||"",n=document.getElementById("orderMonth")?.value||"",s=document.getElementById("orderNote"),r=s?s.value:"";typeof showLoading=="function"&&showLoading("L\u01B0u \u0111\u01A1n h\xE0ng v\xE0o Cloudflare D1...");try{let i={site:e,thang:n,nguoiDat:t.App&&t.App.user?t.App.user.email:"B\u1EBFp tr\u01B0\u1EDFng Site",ghiChu:r,items:a.map(c=>({maHang:c.maHang,tenSP:c.tenSP,dvt:c.dvt,donGia:c.donGia,soLuong:c.soLuongDat||0,daDat:c.daDat}))},d=await(await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();d.success?(typeof closeGeneralModal=="function"&&closeGeneralModal(),typeof showToast=="function"&&showToast(`\u0110\xE3 t\u1EA1o \u0111\u01A1n h\xE0ng th\xE0nh c\xF4ng! M\xE3: ${d.data.maDon}`),o.forEach(c=>{c.soLuongDat=0}),Te()):typeof showToast=="function"&&showToast("L\u1ED7i: "+d.error)}catch(i){typeof showToast=="function"&&showToast("L\u1ED7i: "+(i?.message||i))}finally{typeof hideLoading=="function"&&hideLoading()}}var J=window;J.loadQuota=Te;J.renderOrderTable=vt;J.filterItems=Yn;J.onQtyChange=Zn;J.calcBudget=kt;J.reviewOrder=to;J.submitOrder=eo;J.getAppOrderItems=z;J.setAppOrderItems=Vt;function Ee(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function no(t){return typeof window.cellDate=="function"?window.cellDate(t):`<span class="tabular-nums text-xs text-gray-500">${Y(t)}</span>`}function Ie(t){return typeof window.cellPerson=="function"?window.cellPerson(t):`<span class="text-xs font-medium text-gray-700 dark:text-gray-300">${I(t||"\u2014")}</span>`}function Me(t,o){return typeof window.cellBadge=="function"?window.cellBadge(t,o):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${o}</span>`}function I(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function D(t){return typeof window.fmtVND=="function"?window.fmtVND(t):S(Number(t)||0)}function mt(t){return typeof window.fmtNum=="function"?window.fmtNum(t):L(Number(t)||0)}function Y(t){return t?typeof window.fmtDate=="function"?window.fmtDate(t):G(t):"\u2014"}function Z(t){let o=window,a=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||o.gCurrentUser;if(!a)return!1;if(a.role==="ADMIN"||a.role==="KHO_TRUONG"||a.role==="SUPER_ADMIN")return!0;if(a.permissions&&typeof a.permissions=="object"){let e=a.permissions["portal-history"],n=a.permissions["portal-order"];if(e&&e.canEdit!==void 0)return!!e.canEdit;if(n&&n.canEdit!==void 0)return!!n.canEdit}if(a.role==="BEP_TRUONG"){if(!t)return!0;let e=(t.trangThai||t.status||"").toUpperCase();return e.includes("M\u1EDAI")||e.includes("CH\u1EDC")||e.includes("PENDING")||e===""}return!1}function tt(t){let o=window,a=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||o.gCurrentUser;if(!a)return!1;if(a.role==="ADMIN"||a.role==="KHO_TRUONG"||a.role==="SUPER_ADMIN")return!0;if(a.permissions&&typeof a.permissions=="object"){let e=a.permissions["portal-history"],n=a.permissions["portal-order"];if(e&&e.canDelete!==void 0)return!!e.canDelete;if(n&&n.canDelete!==void 0)return!!n.canDelete}if(a.role==="BEP_TRUONG"){if(!t)return!0;let e=(t.trangThai||t.status||"").toUpperCase();return e.includes("M\u1EDAI")||e.includes("CH\u1EDC")||e.includes("PENDING")||e===""}return!1}function qt(t){let o=window,a=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||o.gCurrentUser;if(!a)return!1;if(a.role==="ADMIN"||a.role==="KHO_TRUONG"||a.role==="SUPER_ADMIN")return!0;if(a.permissions&&typeof a.permissions=="object"){let e=a.permissions["portal-history"],n=a.permissions["portal-order"];if(e&&(e.canAuthenticate!==void 0||e.canVerify!==void 0||e.canEdit!==void 0))return!!(e.canAuthenticate||e.canVerify||e.canEdit);if(n&&(n.canAuthenticate!==void 0||n.canVerify!==void 0||n.canEdit!==void 0))return!!(n.canAuthenticate||n.canVerify||n.canEdit)}return!1}function Xt(t,o,a){let e=Number(t)||1,s=o||{1:"Site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn",3:"Chuy\u1EC3n Tr\u01B0\u1EDFng Kho",4:"Mail cho PMH",5:"PMH \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"\u0110\xE3 giao v\u1EC1 site"}[e]||`B\u01B0\u1EDBc ${e}`,r="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",i="bg-blue-500";return e>=7?(r="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",i="bg-emerald-500"):e>=4?(r="bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",i="bg-indigo-500"):e>=2&&(r="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",i="bg-amber-500"),`
    <button type="button" onclick="openOrderJourneyModal('${a}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${r} hover:shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer" title="B\u1EA5m \u0111\u1EC3 xem v\xE0 x\xE1c th\u1EF1c h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng">
      <span class="w-1.5 h-1.5 rounded-full ${i} animate-pulse shrink-0"></span>
      <span class="font-mono text-[11px] font-bold shrink-0">B${e}/7:</span>
      <span class="truncate max-w-[100px] text-left">${I(s)}</span>
    </button>
  `}function Kt(t){let o=document.getElementById("hsBody"),a=document.getElementById("hsMobileCards");if(!t||!t.length){o&&(o.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),a&&(a.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}o&&(o.innerHTML=t.map(e=>{let n=Z(e),s=tt(e);return`
        <tr>
          <td class="col-code min-w-[130px]">${Ee(e.maDon)}</td>
          <td class="col-date min-w-[110px]">${no(e.ngayDat)}</td>
          <td class="min-w-[260px] max-w-[360px]">
            <div class="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-normal leading-snug break-words">
              ${I(e.site||"\u2014")}
            </div>
          </td>
          <td class="min-w-[130px]">${Ie(e.nguoiDat)}</td>
          <td class="col-num">${e.soDong}</td>
          <td class="col-num font-medium">${mt(e.tongSL)}</td>
          <td class="col-num font-semibold text-brand-600 dark:text-brand-400">${D(e.tongTien)}</td>
          <td class="col-badge min-w-[140px] text-center">${Me("neutral",e.trangThai||"M\u1EDBi t\u1EA1o")}</td>
          <td class="text-center min-w-[170px]">
            ${Xt(e.currentStep,e.currentStepName,e.maDon)}
          </td>
          <td class="col-actions min-w-[220px]">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="viewOrderDetail('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs hover:border-slate-400 dark:hover:border-gray-600 transition" title="Xem chi ti\u1EBFt \u0111\u01A1n h\xE0ng">
                <svg class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>Xem</span>
              </button>
              <button onclick="openOrderJourneyModal('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition" title="Theo d\xF5i & X\xE1c th\u1EF1c h\xE0nh tr\xECnh">
                <svg class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                <span>H\xE0nh tr\xECnh</span>
              </button>
              ${n?`
                <button onclick="openEditOrderModal('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition" title="Ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>S\u1EEDa</span>
                </button>
              `:""}
              ${s?`
                <button onclick="confirmDeleteOrder('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition" title="X\xF3a \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a</span>
                </button>
              `:""}
            </div>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(e=>{let n=Z(e),s=tt(e);return`
        <div class="data-card space-y-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            ${Ee(e.maDon)}
            ${Me("neutral",e.trangThai||"M\u1EDBi t\u1EA1o")}
          </div>
          <div class="font-bold text-sm text-gray-900 dark:text-white leading-snug break-words">
            ${I(e.site||"\u2014")}
          </div>
          <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Ti\u1EBFn \u0111\u1ED9:</span>
            </div>
            ${Xt(e.currentStep,e.currentStepName,e.maDon)}
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="num text-gray-900 dark:text-white whitespace-nowrap">${Y(e.ngayDat)}</b></div>
            <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b>${Ie(e.nguoiDat)}</b></div>
            <div>S\u1ED1 m\u1EB7t h\xE0ng: <b class="num text-gray-900 dark:text-white">${e.soDong} d\xF2ng</b></div>
            <div>T\u1ED5ng SL: <b class="num text-gray-900 dark:text-white">${mt(e.tongSL)}</b></div>
            <div class="col-span-2 flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <span class="text-gray-500 font-medium">T\u1ED5ng gi\xE1 tr\u1ECB \u0111\u01A1n:</span>
              <span class="num font-semibold text-sm text-brand-600 dark:text-brand-400">${D(e.tongTien)}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewOrderDetail('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span>Chi ti\u1EBFt</span>
            </button>
            <button onclick="openOrderJourneyModal('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>H\xE0nh tr\xECnh</span>
            </button>
            ${n?`
              <button onclick="openEditOrderModal('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>S\u1EEDa</span>
              </button>
            `:""}
            ${s?`
              <button onclick="confirmDeleteOrder('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>X\xF3a</span>
              </button>
            `:""}
          </div>
        </div>
      `}).join(""))}function $e(t){let o=window,a=o.App&&o.App.historyOrders?o.App.historyOrders:[];if(!t||t==="ALL"){Kt(a);return}let e=a.filter(n=>{let s=(n.trangThai||"").toUpperCase();return t==="APPROVED"?s.includes("DUY\u1EC6T")||s.includes("APPROVED"):t==="PENDING"?s.includes("CH\u1EDC")||s.includes("T\u1EA0O")||s.includes("PENDING"):t==="DELIVERED"?s.includes("NH\u1EACN")||s.includes("GIAO")||s.includes("DELIVERED"):t==="REJECTED"?s.includes("H\u1EE6Y")||s.includes("T\u1EEA CH\u1ED0I")||s.includes("REJECT"):!0});Kt(e)}async function oo(){let t=window,o=document.getElementById("globalBranchSelect")?.value,a=t.gCurrentUser||(typeof t.loadPersistedUser=="function"?t.loadPersistedUser():null),e=a?a.assignedSite:"",n=localStorage.getItem("orbit_user_site"),s=document.getElementById("hsSite")?.value,r="";o?r=o==="ALL"?"":o:e?r=e==="ALL"?"":e:n?r=n==="ALL"?"":n:s&&(r=s==="ALL"?"":s);let i=document.getElementById("hsCurrentSiteBadge");if(i){if(r&&r!=="ALL"){let m=((typeof t.getAppSitesList=="function"?t.getAppSitesList():[])||[]).find(f=>f.code.toUpperCase()===r.toUpperCase()||f.name===r||f.ten&&f.ten===r);i.textContent=m?m.ten||m.name:r}else i.textContent="T\u1EA5t c\u1EA3 \u0111i\u1EC3m b\xE1n";i.classList.remove("hidden")}let l=document.getElementById("hsSite");l&&(l.value=r);let d=document.getElementById("hsMonth")?.value||"",c="";if(d){let u=d.split("-");c=`${u[1]}/${u[0]}`}try{typeof showLoading=="function"&&showLoading("T\u1EA3i l\u1ECBch s\u1EED \u0111\u01A1n h\xE0ng...");let u=`/api/orders?site=${encodeURIComponent(r)}&thang=${encodeURIComponent(c)}&_t=${Date.now()}`,f=await(await fetch(u,{cache:"no-store",headers:{"Cache-Control":"no-cache",Pragma:"no-cache"}})).json();t.App||(t.App={}),t.App.historyOrders=f.success&&f.data?f.data:[];let y=document.getElementById("hsOrderStatusFilter")?.value||"ALL";$e(y)}catch(u){console.error("loadHistory error:",u)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}async function ao(t){typeof showLoading=="function"&&showLoading("T\u1EA3i chi ti\u1EBFt \u0111\u01A1n...");try{let a=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}`)).json();if(a.success){let{info:e,items:n,timeline:s}=a.data,r=`
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
            <div>
              <div class="tabular-nums font-bold">${e.order_code}</div>
              <div class="text-gray-500 dark:text-gray-400">${e.site_name} \xB7 ${e.ordered_by}</div>
            </div>
            <button onclick="if(typeof exportSingleOrderExcel==='function')exportSingleOrderExcel('${e.order_code}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1">
              Xu\u1EA5t Excel
            </button>
          </div>
          <!-- Desktop Table -->
          <div class="hidden sm:block overflow-x-auto max-h-48 rounded-xl border border-gray-200 dark:border-gray-800">
            <table class="data-table">
              <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2">\u0110VT</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">\u0110\u01A1n gi\xE1</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
              <tbody>
                ${(n||[]).map(i=>`<tr><td class="p-2 tabular-nums">${i.maHang}</td><td class="p-2">${i.tenSP}</td><td class="p-2">${i.dvt}</td><td class="p-2 text-right tabular-nums font-bold">${i.soLuong}</td><td class="p-2 text-right tabular-nums">${D(i.donGia)}</td><td class="p-2 text-right tabular-nums font-bold">${D(i.thanhTien)}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>

          <!-- Native Mobile Cards for Order Details -->
          <div class="block sm:hidden space-y-2 max-h-48 overflow-y-auto">
            ${(n||[]).map(i=>`
              <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
                <div class="min-w-0">
                  <div class="font-bold text-gray-900 dark:text-white truncate">${I(i.tenSP)}</div>
                  <div class="font-mono text-[11px] text-gray-400">${I(i.maHang)} \xB7 <span class="font-sans">${I(i.dvt||"")}</span></div>
                </div>
                <div class="text-right shrink-0">
                  <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${i.soLuong}</div>
                  <div class="num text-[11px] text-gray-500">${D(i.thanhTien)}</div>
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
              <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${e.order_code}')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
                <span>Xem & X\xE1c th\u1EF1c chi ti\u1EBFt</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div class="space-y-2 border-l-2 border-indigo-200 dark:border-indigo-800/80 pl-3">
              ${(s||[]).map(i=>`
                <div class="p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
                  <div class="flex justify-between font-bold text-gray-800 dark:text-gray-100">
                    <span>B\u01B0\u1EDBc ${i.buoc}: ${i.tenBuoc}</span>
                    <span class="tabular-nums text-gray-400 dark:text-gray-500 font-normal">${i.thoiGian?Y(i.thoiGian):""}</span>
                  </div>
                  <div class="text-gray-500 dark:text-gray-400 mt-0.5">${i.nguoiXuLy||"H\u1EC7 th\u1ED1ng"} \xB7 Tr\u1EA1ng th\xE1i: <span class="font-bold text-brand-700 dark:text-brand-400">${i.trangThai}</span>${i.ghiChu?` \xB7 <span class="italic text-gray-600 dark:text-gray-300">"${I(i.ghiChu)}"</span>`:""}</div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>H\xE0nh tr\xECnh \u0111\u01A1n</span>
            </button>
            <div class="flex items-center gap-2">
              ${Z(e)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openEditOrderModal('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>Ch\u1EC9nh s\u1EEDa \u0111\u01A1n</span>
                </button>
              `:""}
              ${tt(e)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); confirmDeleteOrder('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a \u0111\u01A1n h\xE0ng</span>
                </button>
              `:""}
            </div>
          </div>
        </div>
      `;typeof openGeneralModal=="function"&&openGeneralModal(`\u0110\u01A1n h\xE0ng ${t}`,r)}}catch(o){typeof showToast=="function"&&showToast("L\u1ED7i: "+(o?.message||o))}finally{typeof hideLoading=="function"&&hideLoading()}}var ro=null,so=null,Ut=[{step:1,name:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",desc:"\u0110i\u1EC3m b\xE1n t\u1EA1o phi\u1EBFu \u0111\u1EB7t h\xE0ng th\xE0nh c\xF4ng qua h\u1EC7 th\u1ED1ng Portal"},{step:2,name:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",desc:"Admin/B\u1ED9 ph\u1EADn \u0111i\u1EC1u ph\u1ED1i ki\u1EC3m tra \u0111\u1ECBnh m\u1EE9c & duy\u1EC7t ti\u1EBFp nh\u1EADn \u0111\u01A1n"},{step:3,name:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",desc:"Th\u1EE7 kho ti\u1EBFp nh\u1EADn y\xEAu c\u1EA7u, ph\xE2n lo\u1EA1i v\xE0 chu\u1EA9n b\u1ECB k\u1EBF ho\u1EA1ch so\u1EA1n"},{step:4,name:"Kho mail cho PMH",desc:"Kho ph\u1ED1i h\u1EE3p ph\xF2ng mua h\xE0ng ho\u1EB7c nh\xE0 cung c\u1EA5p ki\u1EC3m tra t\u1ED3n kho"},{step:5,name:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",desc:"Ph\xF2ng mua h\xE0ng x\xE1c nh\u1EADn \u0111\u01A1n h\xE0ng v\u1EDBi NCC ho\u1EB7c xu\u1EA5t kho t\u1ED5ng"},{step:6,name:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",desc:"H\xE0ng h\xF3a t\u1EADp k\u1EBFt, ki\u1EC3m \u0111\u1EBFm ch\u1EA5t l\u01B0\u1EE3ng v\xE0 \u0111\xF3ng g\xF3i chuy\u1EC3n \u0111i"},{step:7,name:"Kho giao v\u1EC1 c\xE1c site",desc:"\u0110ang v\u1EADn chuy\u1EC3n giao v\u1EC1 \u0111i\u1EC3m b\xE1n / B\u1EBFp tr\u01B0\u1EDFng k\xFD nh\u1EADn \u0111\u1EE7"}];function Gt(t,o){let a=document.getElementById("journeyTimelineContainer");if(!a)return;let e=document.getElementById("journeyCurrentStepText"),n={};(o||[]).forEach(i=>{let l=Number(i.buoc);l&&(n[l]=i)});let s=Object.keys(n).map(Number),r=s.length?Math.max(...s):1;e&&(e.textContent=`B\u01B0\u1EDBc ${r}/7 (${Ut[r-1]?.name||""})`),a.innerHTML=Ut.map(i=>{let l=n[i.step],d=l&&(l.trangThai==="Ho\xE0n th\xE0nh"||l.trangThai==="Ho\xE0n t\u1EA5t"),c=i.step===r||l&&!d,u="bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700",m=`<span class="font-mono text-xs font-bold">${i.step}</span>`,f="border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/60",y="text-gray-500 dark:text-gray-400 font-medium",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Ch\u1EDD x\u1EED l\xFD</span>';return d?(u="bg-emerald-600 text-white border-emerald-600 shadow-sm",m='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>',f="border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20",y="text-emerald-900 dark:text-emerald-200 font-bold",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>\u0110\xE3 ho\xE0n th\xE0nh</span>'):c&&(u="bg-indigo-600 text-white border-indigo-600 shadow-sm ring-4 ring-indigo-100 dark:ring-indigo-950/60",m='<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg>',f="border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-200 dark:ring-indigo-800/50",y="text-indigo-900 dark:text-indigo-100 font-bold",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>\u0110ang x\u1EED l\xFD</span>'),`
      <div class="relative flex items-start gap-3 group">
        <div class="absolute -left-[27px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${u}">
          ${m}
        </div>
        <div class="flex-1 p-3 rounded-xl border ${f} shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs ${y}">B\u01B0\u1EDBc ${i.step}: ${I(l?.tenBuoc||i.name)}</span>
            ${p}
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">${I(i.desc)}</p>
          ${l?`
            <div class="pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div class="text-gray-600 dark:text-gray-300">
                Ng\u01B0\u1EDDi x\u1EED l\xFD: <b class="text-gray-900 dark:text-white">${I(l.nguoiXuLy||"H\u1EC7 th\u1ED1ng")}</b>
              </div>
              <div class="text-gray-400 dark:text-gray-500 font-mono">
                ${l.thoiGian?Y(l.thoiGian):""}
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
    `}).join("")}async function io(t){if(!t)return;ro=t,window._currentJourneyOrderCode=t;let o=document.getElementById("modalOrderJourney");if(!o)return;let a=document.getElementById("journeyOrderSubtitle");a&&(a.textContent=`M\xE3 \u0111\u01A1n: ${t}`),typeof showLoading=="function"&&showLoading("T\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng...");try{let n=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!n.success||!n.data){typeof showToast=="function"&&showToast(n.error||"Kh\xF4ng th\u1EC3 t\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng","error");return}let{info:s,timeline:r}=n.data;so=n.data,window._currentJourneyData=n.data;let i=document.getElementById("journeySiteName");i&&(i.textContent=s.site_name||s.site||"\u2014");let l=document.getElementById("journeyOrderedBy");l&&(l.textContent=s.ordered_by||"\u2014");let d=document.getElementById("journeyOrderDate");d&&(d.textContent=Y(s.order_date||""));let c=document.getElementById("journeyBadgeStatus");c&&(c.textContent=s.status||"\u0110ang x\u1EED l\xFD"),Gt(s,r||[]);let u=qt(s),m=document.getElementById("journeyAdminSection");if(m)if(u){m.classList.remove("hidden");let f=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,y=document.getElementById("journeyAdminActor");y&&(y.textContent=f&&(f.fullName||f.email)||"Qu\u1EA3n tr\u1ECB vi\xEAn");let p=r&&r.length?Math.max(...r.map(w=>Number(w.buoc)||1)):1,h=Math.min(p+1,7),g=document.getElementById("journeySelectStep");g&&(g.value=String(h));let x=document.getElementById("journeyStepNote");x&&(x.value="")}else m.classList.add("hidden");o.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(e){console.error("Error openOrderJourneyModal:",e),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi t\u1EA3i h\xE0nh tr\xECnh","error")}finally{typeof hideLoading=="function"&&hideLoading()}}function lo(){let t=document.getElementById("modalOrderJourney");t&&t.classList.add("hidden")}async function co(){let t=ro||window._currentJourneyOrderCode;if(!t)return;let o=document.getElementById("journeySelectStep"),a=document.getElementById("journeyStepStatus"),e=document.getElementById("journeyStepNote"),n=document.getElementById("btnSubmitJourneyStep"),s=Number(o?o.value:1),r=a?a.value:"Ho\xE0n th\xE0nh",i=e?e.value.trim():"",l=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,d=l&&(l.fullName||l.email)||"Admin",u={1:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",3:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",4:"Kho mail cho PMH",5:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"Kho giao v\u1EC1 c\xE1c site"}[s]||`B\u01B0\u1EDBc ${s}`;try{n&&(n.disabled=!0,n.innerHTML='<span class="inline-block animate-spin mr-1">\u23F3</span> \u0110ang l\u01B0u...');let f=await(await fetch("/api/order-journey",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,step:s,stepName:u,status:r,note:i,actor:d})})).json();if(!f.success){typeof showToast=="function"&&showToast(f.error||"C\u1EADp nh\u1EADt b\u01B0\u1EDBc h\xE0nh tr\xECnh th\u1EA5t b\u1EA1i","error");return}if(typeof showToast=="function"&&showToast(`\u0110\xE3 x\xE1c th\u1EF1c th\xE0nh c\xF4ng B\u01B0\u1EDBc ${s}: ${u}`,"success"),f.data&&f.data.timeline){let y=so?.info||window._currentJourneyData?.info||{order_code:t};y.status=f.data.orderStatus;let p=document.getElementById("journeyBadgeStatus");p&&(p.textContent=y.status),Gt(y,f.data.timeline),o&&s<7&&(o.value=String(s+1)),e&&(e.value="")}typeof window.loadHistory=="function"&&window.loadHistory()}catch(m){console.error("Error submitJourneyStep:",m),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi c\u1EADp nh\u1EADt ti\u1EBFn \u0111\u1ED9","error")}finally{n&&(n.disabled=!1,n.innerHTML='<i data-lucide="check" class="w-3.5 h-3.5"></i><span>X\xE1c nh\u1EADn c\u1EADp nh\u1EADt b\u01B0\u1EDBc n\xE0y</span>',typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons())}}var N=[],_e=null;async function uo(t){if(!Z()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}typeof showLoading=="function"&&showLoading("\u0110ang t\u1EA3i th\xF4ng tin \u0111\u01A1n h\xE0ng...");try{let a=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!a.success||!a.data)throw new Error(a.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n h\xE0ng");let{info:e,items:n}=a.data,s=document.getElementById("editOrderCode");s&&(s.value=e.order_code||t);let r=document.getElementById("editOrderSubtitle");r&&(r.textContent=`M\xE3 \u0111\u01A1n: ${e.order_code||t}`);let i=document.getElementById("editOrderSite");if(i){let p=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[])||[];i.innerHTML=p.map(h=>{let g=h.ten||h.name||h.code||h,x=e.site_name===g||e.site_name===h.name||e.site_name===h.code?"selected":"";return`<option value="${g}" ${x}>${g}</option>`}).join(""),e.site_name&&!p.some(h=>(h.ten||h.name||h.code)===e.site_name)&&i.insertAdjacentHTML("afterbegin",`<option value="${e.site_name}" selected>${e.site_name}</option>`)}let l=document.getElementById("editOrderDate");l&&(l.value=(e.order_date||"").slice(0,10));let d=document.getElementById("editOrderStatus");d&&(d.value=e.status||"M\u1EDBi t\u1EA1o");let c=document.getElementById("editOrderNguoiDat");c&&(c.value=e.ordered_by||"");let u=document.getElementById("editOrderThang");u&&(u.value=e.applied_month||"");let m=document.getElementById("editOrderGhiChu");m&&(m.value=""),N=(n||[]).map(p=>({maHang:p.maHang||p.item_code,tenSP:p.tenSP||p.item_name,dvt:p.dvt||p.unit||"Ph\u1EA7n",soLuong:Number(p.soLuong??p.order_qty??1),donGia:Number(p.donGia??p.unit_price??0),thanhTien:Number(p.thanhTien??(p.soLuong||1)*(p.donGia||0)),ghiChu:p.ghiChu||""})),window._editOrderItems=N;let f=document.getElementById("editOrderAddSelect");if(f){let p=window,h=p.App&&p.App.items&&p.App.items.length?p.App.items:[];if(!h.length)try{let x=await(await fetch(`/api/quota?site=${encodeURIComponent(e.site_name||"K001")}&thang=${encodeURIComponent(e.applied_month||"")}`)).json();x.success&&x.data?.items&&(h=x.data.items,p.App&&(p.App.items=h))}catch{}f.innerHTML='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng mu\u1ED1n th\xEAm --</option>'+h.map(g=>`
          <option value="${I(g.maHang||g.code)}" 
                  data-name="${I(g.tenHang||g.tenSP||g.name||"")}" 
                  data-unit="${I(g.dvt||g.unit||"Ph\u1EA7n")}" 
                  data-price="${Number(g.donGia||g.price||0)}">
            [${I(g.maHang||g.code)}] ${I(g.tenHang||g.tenSP||g.name||"")} (${D(g.donGia||g.price||0)}/${g.dvt||g.unit||""})
          </option>
        `).join("")}ft();let y=document.getElementById("modalEditOrder");y&&y.classList.remove("hidden")}catch(o){console.error("openEditOrderModal error:",o),typeof showToast=="function"&&showToast("L\u1ED7i: "+(o?.message||o),"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}function Be(){let t=document.getElementById("modalEditOrder");t&&t.classList.add("hidden"),N=[],window._editOrderItems=[]}function ft(){let t=document.getElementById("editOrderItemsBody"),o=document.getElementById("editOrderItemsMobile"),a=N;t&&(a.length?t.innerHTML=a.map((e,n)=>`
        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
          <td class="p-2.5 text-center text-gray-400 font-mono">${n+1}</td>
          <td class="p-2.5 font-mono font-medium text-gray-900 dark:text-white">${I(e.maHang)}</td>
          <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">${I(e.tenSP)}</td>
          <td class="p-2.5 text-center text-gray-500">${I(e.dvt)}</td>
          <td class="p-2.5 text-right">
            <input type="number" min="0.1" step="0.5" value="${e.soLuong}" 
                   onchange="updateEditOrderItemQty(${n}, this.value)" 
                   class="w-20 px-2 py-1 text-right font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-500">
          </td>
          <td class="p-2.5 text-right font-mono text-gray-500">${D(e.donGia)}</td>
          <td class="p-2.5 text-right font-mono font-bold text-brand-600 dark:text-brand-400">${D(e.soLuong*e.donGia)}</td>
          <td class="p-2.5 text-center">
            <button type="button" onclick="removeEditOrderItemLine(${n})" class="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors" title="X\xF3a d\xF2ng">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </td>
        </tr>
      `).join(""):t.innerHTML='<tr><td colspan="8" class="p-4 text-center text-gray-400">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o. Vui l\xF2ng th\xEAm m\u1EB7t h\xE0ng b\xEAn d\u01B0\u1EDBi.</td></tr>'),o&&(a.length?o.innerHTML=a.map((e,n)=>`
        <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-bold text-gray-900 dark:text-white">${I(e.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${I(e.maHang)} \xB7 <span class="font-sans">${I(e.dvt)}</span></div>
            </div>
            <button type="button" onclick="removeEditOrderItemLine(${n})" class="p-1 text-rose-500 hover:text-rose-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-200 dark:border-gray-700/60">
            <div class="flex items-center gap-1.5">
              <span class="text-gray-500">S\u1ED1 l\u01B0\u1EE3ng:</span>
              <input type="number" min="0.1" step="0.5" value="${e.soLuong}" 
                     onchange="updateEditOrderItemQty(${n}, this.value)" 
                     class="w-16 px-1.5 py-0.5 text-center font-mono font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
            </div>
            <div class="text-right">
              <div class="font-mono font-bold text-brand-600 dark:text-brand-400">${D(e.soLuong*e.donGia)}</div>
            </div>
          </div>
        </div>
      `).join(""):o.innerHTML='<div class="p-4 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o</div>'),He()}function po(t,o){let a=Math.max(0,Number(o)||0);N&&N[t]&&(N[t].soLuong=a,N[t].thanhTien=a*(N[t].donGia||0),ft())}function go(t){N&&N.length>t&&(N.splice(t,1),ft())}function mo(){let t=document.getElementById("editOrderAddSelect"),o=document.getElementById("editOrderAddQty");if(!t||!t.value){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t m\u1EB7t h\xE0ng \u0111\u1EC3 th\xEAm","warning");return}let a=t.value,e=t.selectedOptions[0],n=e.getAttribute("data-name")||a,s=e.getAttribute("data-unit")||"Ph\u1EA7n",r=Number(e.getAttribute("data-price"))||0,i=Math.max(.1,Number(o?o.value:1)||1),l=N.find(d=>d.maHang===a);l?(l.soLuong+=i,l.thanhTien=l.soLuong*l.donGia):N.push({maHang:a,tenSP:n,dvt:s,soLuong:i,donGia:r,thanhTien:i*r,ghiChu:""}),t.value="",o&&(o.value="1"),ft()}function He(){let t=N,o=0,a=0;t.forEach(r=>{o+=Number(r.soLuong)||0,a+=(Number(r.soLuong)||0)*(Number(r.donGia)||0)});let e=document.getElementById("editOrderItemsCount");e&&(e.textContent=String(t.length));let n=document.getElementById("editOrderTotalQty");n&&(n.textContent=mt(o));let s=document.getElementById("editOrderTotalAmount");s&&(s.textContent=D(a))}async function fo(){if(!Z()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}let t=document.getElementById("editOrderCode")?.value;if(!t){typeof showToast=="function"&&showToast("Thi\u1EBFu m\xE3 \u0111\u01A1n h\xE0ng","error");return}let o=document.getElementById("editOrderSite")?.value,a=document.getElementById("editOrderDate")?.value,e=document.getElementById("editOrderStatus")?.value,n=document.getElementById("editOrderNguoiDat")?.value,s=document.getElementById("editOrderThang")?.value,r=document.getElementById("editOrderGhiChu")?.value,i=N.filter(d=>(Number(d.soLuong)||0)>0);if(!i.length){typeof showToast=="function"&&showToast("\u0110\u01A1n h\xE0ng ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng c\xF3 s\u1ED1 l\u01B0\u1EE3ng > 0","warning");return}let l=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser;typeof showLoading=="function"&&showLoading("\u0110ang l\u01B0u c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng...");try{let c=await(await fetch("/api/order",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,site:o,orderDate:a,status:e,orderedBy:n,month:s,ghiChu:r,actor:l?l.full_name||l.fullName||l.email:"Ng\u01B0\u1EDDi qu\u1EA3n tr\u1ECB",items:i})})).json();if(!c.success)throw new Error(c.error||"C\u1EADp nh\u1EADt th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),Be(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(d){console.error("saveEditOrder error:",d),typeof showToast=="function"&&showToast("L\u1ED7i l\u01B0u \u0111\u01A1n h\xE0ng: "+(d?.message||d),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}async function ho(t){if(!tt()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning");return}_e=t,window._pendingDeleteOrderCode=t;let o=document.getElementById("confirmDeleteOrderCode");o&&(o.textContent=t);let a=document.getElementById("confirmDeleteOrderInfo");a&&(a.innerHTML='<span class="text-gray-400">\u0110ang t\u1EA3i chi ti\u1EBFt \u0111\u01A1n...</span>');let e=document.getElementById("modalConfirmDeleteOrder");e&&e.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();try{let s=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(s.success&&s.data&&a){let{info:r,items:i}=s.data,l=(i||[]).reduce((c,u)=>c+(Number(u.thanhTien)||0),0),d=(i||[]).reduce((c,u)=>c+(Number(u.soLuong)||0),0);a.innerHTML=`
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div>\u0110i\u1EC3m b\xE1n: <b class="text-gray-900 dark:text-white truncate block">${I(r.site_name||"\u2014")}</b></div>
          <div>Ng\xE0y \u0111\u1EB7t: <b class="num font-medium text-gray-900 dark:text-white">${Y(r.order_date)}</b></div>
          <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b class="text-gray-900 dark:text-white truncate block">${I(r.ordered_by||"\u2014")}</b></div>
          <div>Tr\u1EA1ng th\xE1i: <b class="text-brand-600 dark:text-brand-400">${I(r.status||"M\u1EDBi t\u1EA1o")}</b></div>
          <div class="col-span-2 pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span>M\u1EB7t h\xE0ng: <b>${i.length} m\xF3n (${mt(d)} SL)</b></span>
            <span class="font-bold text-sm text-brand-600 dark:text-brand-400">${D(l)}</span>
          </div>
        </div>
      `}}catch{}}function Qt(){let t=document.getElementById("modalConfirmDeleteOrder");t&&t.classList.add("hidden"),_e=null,window._pendingDeleteOrderCode=null}async function bo(){let t=_e||window._pendingDeleteOrderCode;if(t){if(!tt()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning"),Qt();return}typeof showLoading=="function"&&showLoading("\u0110ang x\xF3a \u0111\u01A1n h\xE0ng kh\u1ECFi CSDL...");try{let a=await(await fetch(`/api/order?orderCode=${encodeURIComponent(t)}`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t})})).json();if(!a.success)throw new Error(a.error||"X\xF3a th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 x\xF3a v\u0129nh vi\u1EC5n \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),Qt(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(o){console.error("executeDeleteOrder error:",o),typeof showToast=="function"&&showToast("L\u1ED7i x\xF3a \u0111\u01A1n: "+(o?.message||o),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}}var $=window;$.renderJourneyBadge=Xt;$.renderHsOrdersList=Kt;$.filterHsOrders=$e;$.loadHistory=oo;$.viewOrderDetail=ao;$.canEditOrders=Z;$.canDeleteOrders=tt;$.canAuthenticateJourney=qt;$.STANDARD_STEPS=Ut;$.renderJourneyTimeline=Gt;$.openOrderJourneyModal=io;$.closeOrderJourneyModal=lo;$.submitJourneyStep=co;$.openEditOrderModal=uo;$.closeEditOrderModal=Be;$.renderEditOrderItems=ft;$.updateEditOrderItemQty=po;$.removeEditOrderItemLine=go;$.addEditOrderItemLine=mo;$.recalcEditOrderTotals=He;$.saveEditOrder=fo;$.confirmDeleteOrder=ho;$.closeDeleteOrderModal=Qt;$.executeDeleteOrder=bo;function Ne(t){return t==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse":t==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800":"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"}function yo(t){return t==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800":t==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800":"bg-gray-50 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300 border-gray-200/70 dark:border-gray-700/60"}function xo(t,o){return t<=0?o<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`${t} ng\xE0y`}function wo(t,o){return t<=0?o<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`C\xF2n ${t} ng\xE0y`}function Fe(t){return t==="red"?"text-rose-600 dark:text-rose-400":t==="yellow"?"text-amber-600 dark:text-amber-400":"text-emerald-600 dark:text-emerald-400"}function vo(t){return t==="red"?"text-rose-600 dark:text-rose-400":t==="yellow"?"text-amber-600 dark:text-amber-400":"text-gray-900 dark:text-white"}function Lt(t){return t.batch_code||t.batch_no||t.site_code||"KHO"}function St(t){return t.unit||t.uom||"Ph\u1EA7n"}function ht(t){return typeof t=="number"?t:parseFloat(t||"0")||0}function Re(t){let o=ht(t);return L(o,2)}var O=1,zt=10,Jt="fefo_priority",Ct="asc",R=new Set;function ko(){return R}function Lo(){return O}function So(t){O=t}function De(t){let o=document.getElementById("fefoTableBody"),a=document.getElementById("fefoMobileCards");if(!t||!t.length){o&&(o.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),a&&(a.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}o&&(o.innerHTML=t.map(e=>{let n=Ne(e.danger_level),s=yo(e.danger_level),r=R.has(e.sku),i=Lt(e),l=St(e),d=e.exp_date?e.exp_date.slice(0,10):"\u2014",c=ht(e.qty),u=e.days_remaining!==void 0?e.days_remaining:e.days_left!==void 0?e.days_left:45,m=xo(u,c),f=Fe(e.danger_level),y=(e.item_name||"").replace(/'/g,"\\'"),p=e.fefo_priority??1;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3.5 text-center whitespace-nowrap">
            <input type="checkbox" class="stock-row-checkbox rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer" data-sku="${e.sku}" onchange="toggleStockItemSelect('${e.sku}', this.checked)" ${r?"checked":""}>
          </td>
          <td class="p-3.5 text-center whitespace-nowrap">
            <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs mx-auto">${p}</span>
          </td>
          <td class="p-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${e.sku}')" class="text-brand-500 dark:text-brand-400 hover:underline" title="Xem chi ti\u1EBFt k\u1EF9 thu\u1EADt">
              ${e.sku}
            </a>
          </td>
          <td class="p-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[180px]">${e.item_name}</td>
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
            ${Re(c)} <span class="font-sans text-xs font-normal text-gray-500">${l}</span>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold whitespace-nowrap min-w-[95px] ${f}">${m}</td>
          <td class="p-3.5 text-center whitespace-nowrap min-w-[110px]">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${n}">${e.status_text||"An to\xE0n"}</span>
          </td>
          <td class="p-3.5 text-right whitespace-nowrap min-w-[120px]">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${e.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi ti\u1EBFt k\u1EF9 thu\u1EADt">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openEditItemModal('${e.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Ch\u1EC9nh s\u1EEDa \u0111\u1ECBnh m\u1EE9c an to\xE0n">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="openIssueModal('${e.sku}', '${y}', '${i}', ${c})" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all">
                <i data-lucide="package-minus" class="w-3.5 h-3.5"></i> Xu\u1EA5t B\u1EBFp
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(e=>{let n=Ne(e.danger_level),s=Lt(e),r=St(e),i=e.exp_date?e.exp_date.slice(0,10):"\u2014",l=ht(e.qty),d=e.days_remaining!==void 0?e.days_remaining:e.days_left!==void 0?e.days_left:45,c=wo(d,l),u=vo(e.danger_level),m=Fe(e.danger_level),f=(e.item_name||"").replace(/'/g,"\\'");return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">P${e.fefo_priority??1}</span>
              <span class="font-bold text-xs text-gray-900 dark:text-white truncate">${e.item_name}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 whitespace-nowrap ${n}">${e.status_text||c}</span>
          </div>
          <div class="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-xs">
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">M\xE3 SKU</div>
              <div class="font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap truncate">${e.sku}</div>
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
              <div class="font-mono font-bold text-xs whitespace-nowrap ${m}">${c}</div>
            </div>
            <div class="col-span-2 flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-gray-800">
              <span class="text-xs text-gray-500 font-medium">T\u1ED3n kh\u1EA3 d\u1EE5ng:</span>
              <span class="font-mono font-bold text-sm whitespace-nowrap ${l<0?"text-rose-600":"text-brand-500 dark:text-brand-400"}">${Re(l)} <span class="font-sans text-xs font-normal text-gray-500">${r}</span></span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1">
            <button onclick="openItemDetailModal('${e.sku}')" class="px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">Chi ti\u1EBFt</button>
            <button onclick="openIssueModal('${e.sku}', '${f}', '${s}', ${l})" class="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"><i data-lucide="package-minus" class="w-3 h-3"></i> Xu\u1EA5t B\u1EBFp</button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function st(){let t=(document.getElementById("fefoSearchInput")?.value||"").toLowerCase().trim(),o=document.getElementById("fefoCategoryFilter")?.value||"",a=document.getElementById("fefoStatusFilter")?.value||"",n=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(y=>{let p=!t||y.sku&&y.sku.toLowerCase().includes(t)||y.item_name&&y.item_name.toLowerCase().includes(t)||y.batch_code&&y.batch_code.toLowerCase().includes(t)||y.batch_no&&y.batch_no.toLowerCase().includes(t),h=!o||y.category===o||!!y.category&&y.category.includes(o),g=!0;return a==="safe"?g=y.danger_level==="green":a==="yellow"?g=y.danger_level==="yellow":a==="red"?g=y.danger_level==="red":a&&(g=y.danger_level===a),p&&h&&g});n.sort((y,p)=>{let h=y[Jt]??"",g=p[Jt]??"";return typeof h=="number"&&typeof g=="number"?Ct==="asc"?h-g:g-h:Ct==="asc"?String(h).localeCompare(String(g)):String(g).localeCompare(String(h))});let s=n.length,r=Math.ceil(s/zt)||1;O>r&&(O=r),O<1&&(O=1);let i=(O-1)*zt,l=n.slice(i,i+zt),d=document.getElementById("stockPageEnd");d&&(d.textContent=String(Math.min(i+zt,s)));let c=document.getElementById("stockTotalCount");c&&(c.textContent=String(s));let u=document.getElementById("stockCurrentPageBadge");u&&(u.textContent=`${O}/${r}`);let m=document.getElementById("stockPrevBtn");m&&(m.disabled=O<=1);let f=document.getElementById("stockNextBtn");f&&(f.disabled=O>=r),De(l)}function Co(t){O+=t,st()}function To(t){Jt===t?Ct=Ct==="asc"?"desc":"asc":(Jt=t,Ct="asc"),st()}function Eo(){let t=document.getElementById("fefoSearchInput");t&&(t.value="");let o=document.getElementById("fefoCategoryFilter");o&&(o.value="");let a=document.getElementById("fefoStatusFilter");a&&(a.value=""),O=1,st()}function Io(t){document.querySelectorAll(".stock-row-checkbox").forEach(a=>{a.checked=t;let e=a.dataset.sku;e&&(t?R.add(e):R.delete(e))}),Tt()}function Mo(t,o){o?R.add(t):R.delete(t),Tt()}function Tt(){let t=document.getElementById("stockBulkActionBar"),o=document.getElementById("selectedStockCount");t&&(R.size>0?(t.classList.remove("hidden"),o&&(o.textContent=String(R.size))):t.classList.add("hidden"))}function $o(){R.clear();let t=document.getElementById("selectAllStockCheckbox");t&&(t.checked=!1),document.querySelectorAll(".stock-row-checkbox").forEach(o=>{o.checked=!1}),Tt()}var Yt=null;async function Zt(){try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",a=await(await fetch(`/api/stock?branch=${encodeURIComponent(t)}`)).json();if(a.success){typeof App<"u"&&(App.fefoItems=a.data||[]);let e=document.getElementById("fefoCategoryFilter"),n=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(e&&n.length){let s=e.value,r=Array.from(new Set(n.map(i=>i.category).filter(Boolean))).sort();e.innerHTML='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>'+r.map(i=>`<option value="${i}">${i}</option>`).join(""),s&&r.includes(s)&&(e.value=s)}st()}}catch(t){console.error("Error loading FEFO stock:",t)}}function _o(){let t=document.getElementById("modalFastReceipt");t&&t.classList.remove("hidden")}function Bo(t,o,a,e){let n=document.getElementById("issueSku");n&&(n.value=t);let s=document.getElementById("issueBatchLabel");s&&(s.innerHTML=`<b>${t}</b> - ${o} <br>L\xF4: <b>${a}</b> (Kh\u1EA3 d\u1EE5ng: ${e})`);let r=document.getElementById("modalFastIssue");r&&r.classList.remove("hidden")}function Et(t){let o=document.getElementById(t);o&&o.classList.add("hidden")}async function Ho(){typeof showLoading=="function"&&showLoading("\u0110ang ghi nh\u1EADn nh\u1EADp kho...");try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",o=document.getElementById("recSku"),a=document.getElementById("recBatch"),e=document.getElementById("recMfg"),n=document.getElementById("recExp"),s=document.getElementById("recQty"),r=document.getElementById("recLoc"),i={branch_code:t,sku:o?o.value:"",batch_code:a&&a.value?a.value:"BAT-"+Date.now().toString().slice(-4),mfg_date:e?e.value:"",exp_date:n?n.value:"",qty:s?s.value:"0",storage_loc:r?r.value:""},d=await(await fetch("/api/stock/receipt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();d.success?(Et("modalFastReceipt"),typeof showToast=="function"&&showToast("Nh\u1EADp kho l\xF4 m\u1EDBi th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),Zt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+d.error)}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}async function No(){typeof showLoading=="function"&&showLoading("\u0110ang th\u1EF1c hi\u1EC7n xu\u1EA5t kho FEFO...");try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",o=document.getElementById("issueSku"),a=document.getElementById("issueQty"),e=document.getElementById("issueNote"),n={branch_code:t,sku:o?o.value:"",qty_needed:a?a.value:"0",note:e?e.value:""},r=await(await fetch("/api/stock/issue",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json();r.success?(Et("modalFastIssue"),typeof showToast=="function"&&showToast("Xu\u1EA5t kho chu\u1EA9n FEFO th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),Zt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+r.error)}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}function Fo(t){let a=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(l=>l.sku===t);if(!a)return;let e=document.getElementById("editItemSku"),n=document.getElementById("editItemName"),s=document.getElementById("editItemSafetyStock"),r=document.getElementById("editItemUnit");e&&(e.value=a.sku),n&&(n.value=`${a.sku} - ${a.item_name}`),s&&(s.value=String(a.safety_stock||5)),r&&(r.value=a.unit||a.uom||"Can 5L");let i=document.getElementById("modalEditItem");i&&i.classList.remove("hidden")}function Ro(){let t=document.getElementById("editItemSku"),o=document.getElementById("editItemSafetyStock"),a=document.getElementById("editItemUnit"),e=t?t.value:"",n=o&&parseFloat(o.value)||5,s=a?a.value:"",i=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(l=>l.sku===e);i&&(i.safety_stock=n,i.unit=s),Et("modalEditItem"),typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u1ECBnh m\u1EE9c an to\xE0n cho ${e}!`),st()}async function Do(t){try{let o=document.getElementById("modalInventoryDetail");if(!o)return;o.classList.remove("hidden");let a=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",n=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(p=>p.sku===t);if(!n){let h=await(await fetch(`/api/stock?branch=${encodeURIComponent(a)}`)).json();h.success&&h.data&&(n=h.data.find(g=>g.sku===t))}n||(n={sku:t,item_name:t,category:"Gia v\u1ECB",unit:"\u0110\u01A1n v\u1ECB",qty:12,safety_stock:5,standard_cost_sap:185e3,lead_time_hours:24});let s=document.getElementById("detailItemSku");s&&(s.textContent=n.sku);let r=document.getElementById("detailItemName");r&&(r.textContent=n.item_name||n.sku);let i=document.getElementById("detailItemUnit");i&&(i.textContent=n.unit||n.uom||"\u0110\u01A1n v\u1ECB");let l=document.getElementById("detailBadgeCategory");l&&(l.textContent=(n.sku.slice(0,2)||"GV").toUpperCase());let d=document.getElementById("detailQty");d&&(d.textContent=`${n.qty||0} ${n.unit||n.uom||""}`);let c=document.getElementById("detailSafetyStock");c&&(c.textContent=`${n.safety_stock||5} ${n.unit||n.uom||""}`);let u=document.getElementById("detailStandardCost");u&&(u.textContent=S(Number(n.standard_cost_sap)||185e3));let m=document.getElementById("detailLeadTime");m&&(m.textContent=`${n.lead_time_hours||24}h`);let f=document.getElementById("itemDetailStockChart");if(f&&typeof ApexCharts<"u"){Yt&&Yt.destroy();let p=typeof isDarkModeActive=="function"?isDarkModeActive():!1,g={series:[{name:"T\u1ED3n kho th\u1EF1c t\u1EBF",data:[15,14,16,12,11,14,13,15,14,12,typeof n.qty=="number"?n.qty:parseFloat(String(n.qty))||10]}],colors:["#19723C"],chart:{fontFamily:"'Be Vietnam Pro', sans-serif",type:"area",height:180,toolbar:{show:!1},sparkline:{enabled:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:2.5},fill:{type:"gradient",gradient:{shadeIntensity:1,opacityFrom:.35,opacityTo:.05,stops:[0,95,100]}},xaxis:{categories:["09/11","10/11","11/11","12/11","13/11","14/11","15/11","16/11","17/11","18/11","19/11"],labels:{style:{colors:p?"#94A3B8":"#64748B",fontSize:"10px"}}},yaxis:{labels:{style:{colors:p?"#94A3B8":"#64748B",fontSize:"10px"}}},grid:{borderColor:p?"#1E293B":"#F1F5F9",strokeDashArray:3}};Yt=new ApexCharts(f,g),Yt.render()}let y=document.getElementById("detailTransactionsBody");y&&(y.innerHTML=`
        <tr>
          <td colspan="5" class="py-6 text-center text-gray-400 dark:text-gray-500 text-xs">
            Ch\u01B0a c\xF3 ph\xE1t sinh giao d\u1ECBch cho m\u1EB7t h\xE0ng n\xE0y.
          </td>
        </tr>
      `),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(o){console.error("Error opening item detail:",o)}}function Ao(t,o,a){let n=[["\u01AFu Ti\xEAn FEFO","M\xE3 SKU","T\xEAn M\u1EB7t H\xE0ng","M\xE3 L\xF4","H\u1EA1n D\xF9ng (EXP)","S\u1ED1 L\u01B0\u1EE3ng T\u1ED3n","\u0110\u01A1n V\u1ECB","S\u1ED1 Ng\xE0y C\xF2n","Tr\u1EA1ng Th\xE1i"]];a.forEach(l=>{let d=l.fefo_priority??1,c=l.sku||"",u=l.item_name||"",m=Lt(l),f=l.exp_date?l.exp_date.slice(0,10):"\u2014",y=ht(l.qty),p=St(l),h=l.days_remaining!==void 0?l.days_remaining:l.days_left!==void 0?l.days_left:45,g=l.status_text||"An to\xE0n";n.push([d,c,u,m,f,y,p,h,g])});let s=XLSX.utils.book_new(),r=XLSX.utils.aoa_to_sheet(n),i=XLSX.utils.decode_range(r["!ref"]);r["!cols"]=[{wch:14},{wch:14},{wch:34},{wch:16},{wch:16},{wch:14},{wch:10},{wch:14},{wch:16}];for(let l=i.s.r;l<=i.e.r;++l)for(let d=i.s.c;d<=i.e.c;++d){let c=XLSX.utils.encode_cell({r:l,c:d});if(r[c])if(l===0)r[c].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let u="left",m;d===0||d===1||d===3||d===4||d===6||d===8?u="center":(d===5||d===7)&&(u="right",d===5&&(m="#,##0.00"),d===7&&(m="#,##0"));let f=d===5&&typeof r[c].v=="number"&&r[c].v<0;r[c].s={font:{name:"Aptos",sz:11,bold:!1,color:{rgb:f?"C00000":"000000"}},alignment:{horizontal:u,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},m&&(r[c].z=m)}}r["!freeze"]={xSplit:0,ySplit:1},r["!autofilter"]={ref:r["!ref"]},XLSX.utils.book_append_sheet(s,r,o),XLSX.writeFile(s,t)}function Oo(){let t=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(!t||!t.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}Ao("Danh_Sach_Ton_Kho_FEFO.xlsx","TonKhoFEFO",t)}function Po(){if(R.size===0){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t Excel!");return}let o=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(a=>R.has(a.sku));Ao("Ton_Kho_Duoc_Chon.xlsx","DuocChon",o)}if(typeof window<"u"){let t=window;t.renderFefoRows=De,t.filterFefoLive=st,t.changeStockPage=Co,t.sortStockBy=To,t.resetFefoFilters=Eo,t.toggleSelectAllStock=Io,t.toggleStockItemSelect=Mo,t.updateStockBulkBar=Tt,t.clearStockSelection=$o,t.selectedStockSkus=R,t.getSelectedStockSkus=ko,t.getStockCurrentPage=Lo,t.setStockCurrentPage=So,t.loadStockFEFO=Zt,t.openReceiptModal=_o,t.openIssueModal=Bo,t.closeModal=Et,t.submitReceiptToBackend=Ho,t.submitIssueToBackend=No,t.openEditItemModal=Fo,t.saveItemSpecs=Ro,t.openItemDetailModal=Do,t.exportFefoToExcel=Oo,t.exportSelectedStockExcel=Po}function Ae(t){let o=document.getElementById("ropTableBody"),a=document.getElementById("ropMobileCards");if(!t||!t.length){o&&(o.innerHTML='<tr><td colspan="9" class="p-8 text-center text-emerald-600 dark:text-emerald-400 font-medium">T\u1EA5t c\u1EA3 m\u1EB7t h\xE0ng t\u1EA1i \u0111i\u1EC3m kho n\xE0y \u0111\u1EC1u \u0111\u1EA1t ng\u01B0\u1EE1ng t\u1ED3n an to\xE0n (Kh\xF4ng c\u1EA7n \u0111\u1EB7t th\xEAm).</td></tr>'),a&&(a.innerHTML='<div class="p-6 text-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">T\u1EA5t c\u1EA3 m\u1EB7t h\xE0ng t\u1EA1i \u0111i\u1EC3m kho n\xE0y \u0111\u1EC1u \u0111\u1EA1t ng\u01B0\u1EE1ng t\u1ED3n an to\xE0n.</div>');return}o&&(o.innerHTML=t.map(e=>{let n=e.sku||"",s=e.item_name||n,r=e.unit||e.uom||"Ph\u1EA7n",i=parseFloat(String(e.daily_usage!==void 0?e.daily_usage:10)),l=e.lead_time_days!==void 0?parseFloat(String(e.lead_time_days)):e.lead_time_hours?Math.round(parseFloat(String(e.lead_time_hours))/24):2,d=parseFloat(String(e.safety_stock!==void 0?e.safety_stock:5)),c=parseFloat(String(e.current_stock!==void 0?e.current_stock:0)),u=parseFloat(String(e.rop!==void 0?e.rop:e.rop_threshold!==void 0?e.rop_threshold:25)),m=parseFloat(String(e.suggested_order!==void 0?e.suggested_order:e.suggested_order_qty!==void 0?e.suggested_order_qty:c<u?Math.max(0,35-c):0)),f=e.status||(c<=0?"H\u1EBET H\xC0NG":c<u?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N"),y="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold";return f==="H\u1EBET H\xC0NG"?y="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold":f==="C\u1EA6N \u0110\u1EB6T"&&(y="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold animate-pulse"),`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 text-center font-mono tabular-nums font-bold text-gray-800 dark:text-gray-200 text-xs">${n}</td>
          <td class="p-3 font-semibold text-gray-900 dark:text-white text-xs">${s}</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${L(i,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${l} ng\xE0y</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${L(d,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${c<=0?"text-rose-600":"text-gray-900 dark:text-white"} text-xs">${L(c,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400 text-xs">${L(u,1)} <span class="text-[11px] text-amber-600/70 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${m>0?"text-brand-600 dark:text-brand-400":"text-gray-400"} text-xs">${m>0?"+"+L(m,1):"0"} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] ${y}">${f}</span>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(e=>{let n=e.sku||"",s=e.item_name||n,r=e.unit||e.uom||"Ph\u1EA7n",i=e.lead_time_days!==void 0?parseFloat(String(e.lead_time_days)):e.lead_time_hours?Math.round(parseFloat(String(e.lead_time_hours))/24):2,l=parseFloat(String(e.current_stock!==void 0?e.current_stock:0)),d=parseFloat(String(e.rop!==void 0?e.rop:e.rop_threshold!==void 0?e.rop_threshold:25)),c=parseFloat(String(e.suggested_order!==void 0?e.suggested_order:e.suggested_order_qty!==void 0?e.suggested_order_qty:l<d?Math.max(0,35-l):0)),u=e.status||(l<=0?"H\u1EBET H\xC0NG":l<d?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N"),m="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200";return u==="H\u1EBET H\xC0NG"?m="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200":u==="C\u1EA6N \u0110\u1EB6T"&&(m="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200"),`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-xs text-gray-900 dark:text-white">${s}</div>
              <div class="text-[11px] font-mono text-gray-400 mt-0.5">SKU: ${n}</div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${m}">${u}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>T\u1ED3n hi\u1EC7n t\u1EA1i: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${L(l,1)} ${r}</b></div>
            <div>\u0110i\u1EC3m ROP: <b class="font-mono tabular-nums text-amber-600 dark:text-amber-400">${L(d,1)} ${r}</b></div>
            <div>Lead time: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${i} ng\xE0y</b></div>
            <div>\u0110\u1EC1 xu\u1EA5t \u0111\u1EB7t: <b class="font-mono tabular-nums font-semibold text-sm ${c>0?"text-brand-600 dark:text-brand-400":"text-gray-500"}">${c>0?"+"+L(c,1):"0"} ${r}</b></div>
          </div>
        </div>
      `}).join(""))}async function jo(){let t=localStorage.getItem("orbit_user_site"),o=document.getElementById("globalBranchSelect")?.value,a=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,e=t||o||a||"K001";(e==="ALL"||e==="all")&&(e="K001"),e=e.toUpperCase();let n=document.getElementById("whRopCurrentSiteBadge");if(n){let l=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(d=>d.code&&d.code.toUpperCase()===e.toUpperCase());n.textContent=l?l.ten||l.name:e}let s=document.getElementById("ropTableBody"),r=document.getElementById("ropMobileCards");s&&(s.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400">\u0110ang t\xEDnh to\xE1n ng\u01B0\u1EE1ng an to\xE0n ROP...</td></tr>'),r&&(r.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\xEDnh to\xE1n ng\u01B0\u1EE1ng an to\xE0n ROP...</div>');try{let l=await(await fetch(`/api/reorder?site=${encodeURIComponent(e)}&branch=${encodeURIComponent(e)}&nocache=1`)).json();if(l.success){let d=l.data||[];typeof App<"u"&&(App.ropItems=d),Ae(d)}else s&&(s.innerHTML=`<tr><td colspan="9" class="p-8 text-center text-rose-500">L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u: ${l.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</td></tr>`),r&&(r.innerHTML=`<div class="p-6 text-center text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-2xl">L\u1ED7i: ${l.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</div>`)}catch(i){console.error("loadReorderROP error:",i),s&&(s.innerHTML=`<tr><td colspan="9" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${i.message}</td></tr>`)}}function te(t){let o=document.getElementById("leadTimeTableBody"),a=document.getElementById("leadTimeMobileCards");if(!t||!t.length){o&&(o.innerHTML='<tr><td colspan="7" class="p-8 text-center text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n PO n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 K\u1EF3 th\xE1ng \u0111\xE3 ch\u1ECDn.</td></tr>'),a&&(a.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n PO n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 K\u1EF3 th\xE1ng \u0111\xE3 ch\u1ECDn.</div>');return}o&&(o.innerHTML=t.map(e=>{let n=e.supplier_name||e.vendor_name||"B\u1EBFp Trung T\xE2m Siba Food",s=e.order_date||(e.order_time?e.order_time.split(" ")[0]:"\u2014"),r=e.actual_delivery_date||(e.received_time?e.received_time.split(" ")[0]:"\u2014"),i=e.actual_lead_time_days!==null&&e.actual_lead_time_days!==void 0?e.actual_lead_time_days+" ng\xE0y":e.lead_time_hours?e.lead_time_hours+"h":"\u2014",l=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N"),d=l==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA",c=l==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao",u=d?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200":c?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200":"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 font-mono tabular-nums font-bold text-gray-900 dark:text-white">${e.po_number}</td>
          <td class="p-3 font-mono tabular-nums font-bold text-brand-600 dark:text-brand-400">
            <span class="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60">${e.branch_code||e.site||"\u2014"}</span>
          </td>
          <td class="p-3 font-bold text-gray-800 dark:text-gray-200">${n}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${s}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${r}</td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${!d&&!c?"text-rose-600":"text-emerald-600"}">${i}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${u}">${l}</span>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(e=>{let n=e.supplier_name||e.vendor_name||"B\u1EBFp Trung T\xE2m Siba Food",s=e.order_date||(e.order_time?e.order_time.split(" ")[0]:"\u2014"),r=e.actual_delivery_date||(e.received_time?e.received_time.split(" ")[0]:"\u2014"),i=e.committed_lead_time_days?e.committed_lead_time_days+" ng\xE0y":e.sla_target_hours?e.sla_target_hours+"h":"24h",l=e.actual_lead_time_days!==null&&e.actual_lead_time_days!==void 0?e.actual_lead_time_days+" ng\xE0y":e.lead_time_hours?e.lead_time_hours+"h":"\u2014",d=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N"),c=d==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA",u=d==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao",m=c?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200":u?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200":"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200";return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-xs text-gray-900 dark:text-white">${n}</div>
              <div class="text-xs font-mono tabular-nums text-gray-400">PO: ${e.po_number} \xB7 \u0110i\u1EC3m: <b class="text-brand-600 dark:text-brand-400">${e.branch_code||e.site||"\u2014"}</b></div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${m}">${d}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${s}</b></div>
            <div>Ng\xE0y nh\u1EADn: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${r}</b></div>
            <div>Cam k\u1EBFt SLA: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${i}</b></div>
            <div>Lead time th\u1EF1c t\u1EBF: <b class="font-mono tabular-nums font-bold ${!c&&!u?"text-rose-600":"text-emerald-600"}">${l}</b></div>
          </div>
        </div>
      `}).join(""))}function Oe(t){let o=typeof App<"u"&&App.leadTimeRawData?App.leadTimeRawData:[];if(!t||t==="ALL"){te(o);return}let a=o.filter(e=>{let n=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N");return t==="ON_TIME"?n==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA":t==="DELIVERING"?n==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao":t==="LATE"?n==="TR\u1EC4 H\u1EA0N"||e.sla_status==="Tr\u1EC5 h\u1EB9n NCC":!0});te(a)}async function Wo(){let t=document.getElementById("globalBranchSelect")?.value,a=((typeof App<"u"&&App.currentBranch?App.currentBranch:"")||t||"").toUpperCase(),e=document.getElementById("leadTimeMonth")?.value||"",n=new URLSearchParams;a&&a!=="ALL"&&n.set("site",a),e&&n.set("month",e);let s=n.toString()?`/api/leadtime?${n.toString()}`:"/api/leadtime";try{let i=await(await fetch(s)).json(),l=i.success&&i.data?i.data:[];typeof App<"u"&&(App.leadTimeRawData=l);let d=document.getElementById("leadTimeSlaFilter")?.value||"ALL";Oe(d)}catch(r){console.error("Error loading Lead Time:",r)}}function Vo(){let t=typeof App<"u"&&App.ropItems?App.ropItems:[];if(!t||!t.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u c\u1EA3nh b\xE1o ROP \u0111\u1EC3 xu\u1EA5t Excel!");return}let a=[["M\xE3 SKU","T\xEAn Gia V\u1ECB / M\u1EB7t H\xE0ng","\u0110VT","Ti\xEAu Th\u1EE5/Ng\xE0y","Lead Time (ng\xE0y)","T\u1ED3n An To\xE0n","T\u1ED3n Hi\u1EC7n T\u1EA1i","Ng\u01B0\u1EE1ng ROP","\u0110\u1EC1 Xu\u1EA5t \u0110\u1EB7t","Tr\u1EA1ng Th\xE1i"]];t.forEach(r=>{let i=r.sku||"",l=r.item_name||i,d=r.unit||r.uom||"Ph\u1EA7n",c=parseFloat(String(r.daily_usage!==void 0?r.daily_usage:10)),u=r.lead_time_days!==void 0?parseFloat(String(r.lead_time_days)):r.lead_time_hours?Math.round(parseFloat(String(r.lead_time_hours))/24):2,m=parseFloat(String(r.safety_stock!==void 0?r.safety_stock:5)),f=parseFloat(String(r.current_stock!==void 0?r.current_stock:0)),y=parseFloat(String(r.rop!==void 0?r.rop:r.rop_threshold!==void 0?r.rop_threshold:25)),p=parseFloat(String(r.suggested_order!==void 0?r.suggested_order:r.suggested_order_qty!==void 0?r.suggested_order_qty:f<y?Math.max(0,35-f):0)),h=r.status||(f<=0?"H\u1EBET H\xC0NG":f<y?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N");a.push([i,l,d,c,u,m,f,y,p,h])});let e=XLSX.utils.book_new(),n=XLSX.utils.aoa_to_sheet(a),s=XLSX.utils.decode_range(n["!ref"]);n["!cols"]=[{wch:14},{wch:34},{wch:10},{wch:14},{wch:16},{wch:14},{wch:14},{wch:14},{wch:14},{wch:16}];for(let r=s.s.r;r<=s.e.r;++r)for(let i=s.s.c;i<=s.e.c;++i){let l=XLSX.utils.encode_cell({r,c:i});if(n[l])if(r===0)n[l].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let d="left",c;i===0||i===2||i===9?d="center":i>=3&&i<=8&&(d="right",c="#,##0.0",(i===4||i===8)&&(c="#,##0"));let u=i===6&&typeof n[l].v=="number"&&n[l].v<=0;n[l].s={font:{name:"Aptos",sz:11,bold:i===6||i===8,color:{rgb:u?"C00000":"000000"}},alignment:{horizontal:d,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},c&&(n[l].z=c)}}n["!freeze"]={xSplit:0,ySplit:1},n["!autofilter"]={ref:n["!ref"]},XLSX.utils.book_append_sheet(e,n,"ROP"),XLSX.writeFile(e,"De_Xuat_Dat_Hang_ROP.xlsx")}if(typeof window<"u"){let t=window;t.loadReorderROP=jo,t.renderRopTable=Ae,t.loadLeadTime=Wo,t.renderLeadTimeTable=te,t.filterLeadTimeSla=Oe,t.downloadRopExcel=Vo}function Pe(t){let o=t?"#94A3B8":"#64748B",a=t?"#1E293B":"#F1F5F9";if(typeof chartInboundOutbound<"u"&&chartInboundOutbound)try{chartInboundOutbound.updateOptions({chart:{foreColor:o},grid:{borderColor:a},xaxis:{labels:{style:{colors:o}}},yaxis:{labels:{style:{colors:o}}},tooltip:{theme:t?"dark":"light"}})}catch{}if(typeof chartSafetyGauge<"u"&&chartSafetyGauge)try{chartSafetyGauge.updateOptions({plotOptions:{radialBar:{track:{background:t?"#1C243D":"#E8EAEE"},dataLabels:{value:{color:t?"#FFFFFF":"#1D2939"}}}}})}catch{}if(typeof chartValueTrend<"u"&&chartValueTrend)try{chartValueTrend.updateOptions({chart:{foreColor:o},grid:{borderColor:a},xaxis:{labels:{style:{colors:o}}},yaxis:{labels:{style:{colors:o}}}})}catch{}}function je(t){let o=document.getElementById("stockAlertsTableBody"),a=document.getElementById("dashStockAlertsMobileCards");if(!o&&!a)return;if(!t||t.length===0){o&&(o.innerHTML=`
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
      `),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();return}o&&(o.innerHTML=t.map(n=>{let s="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40",r="B\xECnh th\u01B0\u1EDDng";return n.alert_level==="OUT_OF_STOCK"?(s="bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold",r="H\u1EBFt h\xE0ng"):n.alert_level==="NEAR_EXPIRY"?(s="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 font-bold",r=`C\u1EADn Date (${n.days_left||0}d)`):n.alert_level==="LOW_STOCK"&&(s="bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/40 font-bold",r="D\u01B0\u1EDBi m\u1EE9c an to\xE0n"),`
        <tr class="hover:bg-gray-50/60 dark:hover:bg-white/2 transition-colors">
          <td class="px-5 py-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${n.sku}')" class="text-brand-500 hover:underline flex items-center gap-1">
              ${n.sku}
            </a>
          </td>
          <td class="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[160px]">
            <div>${n.item_name||n.sku}</div>
            <span class="text-xs text-gray-400 font-normal">${n.category||"Gia v\u1ECB"} \u2022 ${n.unit||"\u0110\u01A1n v\u1ECB"}</span>
          </td>
          <td class="px-5 py-3.5 whitespace-nowrap min-w-[155px]">
            <div class="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">${n.batch_code||"L\xF4 kho"}</div>
            <div class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 whitespace-nowrap">
              <i data-lucide="calendar" class="w-3 h-3 shrink-0"></i>
              <span>EXP: ${n.exp_date?n.exp_date.slice(0,10):"Ch\u01B0a c\xF3"}</span>
            </div>
          </td>
          <td class="px-5 py-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            ${n.qty} ${n.unit||""}
          </td>
          <td class="px-5 py-3.5 text-right font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            ${n.safety_stock||5} ${n.unit||""}
          </td>
          <td class="px-5 py-3.5 text-center whitespace-nowrap">
            <span class="inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${s}">
              ${r}
            </span>
          </td>
          <td class="px-5 py-3.5 text-right whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${n.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi ti\u1EBFt">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openReceiptModal('${n.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Nh\u1EADp b\u1ED5 sung">
                <i data-lucide="package-plus" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(n=>{let s="badge-neutral",r="B\xECnh th\u01B0\u1EDDng";return n.alert_level==="OUT_OF_STOCK"?(s="badge-danger",r="H\u1EBFt h\xE0ng"):n.alert_level==="NEAR_EXPIRY"?(s="badge-warning",r=`C\u1EADn Date (${n.days_left||0}d)`):n.alert_level==="LOW_STOCK"&&(s="badge-warning",r="D\u01B0\u1EDBi m\u1EE9c an to\xE0n"),`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="code font-bold text-brand-600 dark:text-brand-400">${b(n.sku||"")}</span>
              <span class="badge ${s}">${r}</span>
            </div>
            <span class="text-xs text-gray-400">${b(n.batch_code||"L\xF4 kho")}</span>
          </div>
          <div class="data-card-body space-y-1.5">
            <div class="font-semibold text-sm text-gray-900 dark:text-white">${b(n.item_name||n.sku||"")}</div>
            <div class="text-xs text-gray-400">${b(n.category||"Gia v\u1ECB")} \u2022 ${b(n.unit||"\u0110VT")}</div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span class="text-gray-400">T\u1ED3n hi\u1EC7n t\u1EA1i:</span>
                <span class="num font-semibold text-gray-900 dark:text-white ml-1">${n.qty} ${b(n.unit||"")}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400">An to\xE0n:</span>
                <span class="num font-semibold text-amber-600 dark:text-amber-400 ml-1">${n.safety_stock||5} ${b(n.unit||"")}</span>
              </div>
            </div>
            ${n.exp_date?`
              <div class="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 pt-1">
                <span>H\u1EA1n d\xF9ng:</span>
                <span class="num font-medium">${G(n.exp_date.slice(0,10))}</span>
              </div>
            `:""}
          </div>
          <div class="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="openItemDetailModal('${n.sku}')" class="btn btn-secondary btn-sm">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Chi ti\u1EBFt
            </button>
            <button onclick="openReceiptModal('${n.sku}')" class="btn btn-primary btn-sm">
              <i data-lucide="package-plus" class="w-3.5 h-3.5"></i> Nh\u1EADp b\u1ED5 sung
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();let e=document.documentElement.classList.contains("dark");Pe(e)}function We(t){typeof renderKpi=="function"&&(renderKpi("dashMetricValue",{value:t.total_value||0,sub:"Theo gi\xE1 b\xECnh qu\xE2n kho"}),renderKpi("dashMetricSkus",{value:t.total_skus||0,unit:"M\xE3",isCurrency:!1,sub:"To\xE0n b\u1ED9 danh m\u1EE5c kho"}),renderKpi("dashMetricRop",{value:t.rop_reorder_count||0,unit:"M\xE3",isCurrency:!1,deltaText:(t.rop_reorder_count||0)>0?`${t.rop_reorder_count} m\xE3 c\u1EA7n \u0111\u1EB7t`:"An to\xE0n",deltaGood:(t.rop_reorder_count||0)===0,sub:"Ch\u1EA1m ng\u01B0\u1EE1ng an to\xE0n"}),renderKpi("dashMetricExp",{value:t.critical_exp_count||0,unit:"L\xF4",isCurrency:!1,deltaText:(t.critical_exp_count||0)>0?`${t.critical_exp_count} l\xF4 xu\u1EA5t g\u1EA5p`:"An to\xE0n",deltaGood:(t.critical_exp_count||0)===0,sub:"\u01AFu ti\xEAn xu\u1EA5t FEFO"}),renderKpi("dashMetricSlow",{value:t.slow_moving_count!==void 0?t.slow_moving_count:0,unit:"M\xE3",isCurrency:!1,sub:"L\u01B0u kho kh\xF4ng bi\u1EBFn \u0111\u1ED9ng"}));let o=document.getElementById("dashLeadTimeText");if(o&&(o.textContent=`${t.avg_lead_time||24.5}h`),typeof chartSafetyGauge<"u"&&chartSafetyGauge&&typeof t.safety_rate<"u")try{chartSafetyGauge.updateSeries([parseFloat(String(t.safety_rate))])}catch{}if(typeof chartInboundOutbound<"u"&&chartInboundOutbound&&t.chart_inbound_outbound){let a=t.chart_inbound_outbound,e=Array.isArray(a.categories)?a.categories:String(a.categories||"").split(" ").filter(Boolean),n=Array.isArray(a.inbound)?a.inbound:String(a.inbound||"").split(" ").filter(Boolean).map(Number),s=Array.isArray(a.outbound)?a.outbound:String(a.outbound||"").split(" ").filter(Boolean).map(Number);if(e.length)try{chartInboundOutbound.updateOptions({xaxis:{categories:e}}),chartInboundOutbound.updateSeries([{name:"Nh\u1EADp kho (Tr \u20AB)",data:n},{name:"Xu\u1EA5t kho (Tr \u20AB)",data:s}])}catch(r){console.warn("Chart update notice:",r)}}je(t.alerts||[])}async function qo(){try{let t=(typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL").toUpperCase(),o=document.getElementById("dashBranchTitle");o&&(o.textContent=t&&t!=="ALL"?t:"To\xE0n Chu\u1ED7i");let e=await(await fetch(`/api/dashboard-summary?branch=${encodeURIComponent(t)}&refresh=true`)).json();if(e.success){let n=e.data;We(n);let s=document.getElementById("dashCritCount");s&&(s.textContent=String(n.critical_exp_count||0));let r=document.getElementById("dashRopCount");r&&(r.textContent=String(n.rop_reorder_count||0));let i=document.getElementById("dashLeadTime");i&&(i.textContent=`${n.avg_lead_time||24.5}h`);let l=document.getElementById("dashTotalQty");l&&(l.textContent=L(n.total_qty||0,1));let d=document.getElementById("dashTotalSkus");d&&(d.textContent=`${n.total_skus||0} SKU \u0111ang qu\u1EA3n l\xFD`);let c=document.getElementById("badgeCritNav");c&&(c.textContent=String(n.critical_exp_count||0));let u=document.getElementById("badgeRopNav");u&&(u.textContent=String(n.rop_reorder_count||0))}}catch(t){console.error("Error loading dashboard summary:",t)}}if(typeof window<"u"){let t=window;t.loadDashboardSummary=qo,t.updateTailadminDashboard=We,t.renderStockAlertsTable=je,t.updateApexChartsTheme=Pe}var P=[],it=[];function si(){return P}function ii(){return it}function Ve(){let t=(document.getElementById("whInvSearchInput")?.value||"").toLowerCase().trim(),o=document.getElementById("whInvCategorySelect")?.value||"",a=document.getElementById("whInvStatusSelect")?.value||"ALL",e=[...P];t&&(e=e.filter(h=>h.sku&&h.sku.toLowerCase().includes(t)||h.name&&h.name.toLowerCase().includes(t))),o&&(e=e.filter(h=>h.category===o)),a==="HAS_RECEIPT"?e=e.filter(h=>parseFloat(String(h.receipt_qty||0))>0):a==="IN_STOCK"?e=e.filter(h=>parseFloat(String(h.book_qty||0))>0):a==="HAS_BATCH"?e=e.filter(h=>parseInt(String(h.batch_count||0),10)>0):a==="NEGATIVE"&&(e=e.filter(h=>parseFloat(String(h.book_qty||0))<0)),it=e,typeof window<"u"&&(window.gWhFilteredInventory=e);let n=0,s=0,r=0,i=0;e.forEach(h=>{n+=parseFloat(String(h.receipt_qty||0)),s+=parseFloat(String(h.book_qty||0)),r+=parseFloat(String(h.total_value||0)),i+=parseInt(String(h.batch_count||0),10)});let l=document.getElementById("whKpiTotalSkus");l&&(l.textContent=L(e.length,0));let d=document.getElementById("whKpiTotalReceiptQty");d&&(d.textContent=L(Math.round(n*10)/10,1));let c=document.getElementById("whKpiTotalBookQty");c&&(c.textContent=L(Math.round(s*10)/10,1));let u=document.getElementById("whKpiTotalValue");u&&(u.textContent=S(r));let m=document.getElementById("whKpiTotalBatches");m&&(m.textContent=L(i,0));let f=document.getElementById("whInvRowCount");f&&(f.textContent=L(e.length,0));let y=document.getElementById("whInventoryTableBody"),p=document.getElementById("whInventoryMobileCards");if(!e.length){y&&(y.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>'),p&&(p.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</div>');return}y&&(y.innerHTML=e.map((h,g)=>{let x=parseFloat(String(h.receipt_qty||0)),w=parseFloat(String(h.book_qty||0)),v=parseInt(String(h.batch_count||0),10),C="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";return w<0?C="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/80":w>0&&(C="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80"),`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="px-2 py-2 text-center text-gray-400 tabular-nums font-mono">${g+1}</td>
          <td class="px-2 py-2 whitespace-nowrap">
            <button onclick="openWhItemHistoryModal('${h.sku}')" class="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1" title="Xem th\u1EBB kho chi ti\u1EBFt">
              <span>${h.sku}</span>
              <i data-lucide="external-link" class="w-3 h-3 opacity-60"></i>
            </button>
          </td>
          <td class="px-2 py-2 font-semibold text-gray-900 dark:text-white min-w-[150px]">
            <div class="line-clamp-2">${h.name||h.sku}</div>
          </td>
          <td class="px-2 py-2 whitespace-nowrap text-center">
            <span class="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium border border-gray-200/60 dark:border-gray-700/60 inline-block max-w-[110px] truncate" title="${h.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}">${h.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}</span>
          </td>
          <td class="px-1.5 py-2 text-center whitespace-nowrap font-medium text-gray-600 dark:text-gray-300">${h.unit||"Ph\u1EA7n"}</td>
          <td class="px-2 py-2 text-right whitespace-nowrap bg-emerald-50/30 dark:bg-emerald-950/10">
            <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs px-1.5 py-0.5 rounded-md bg-emerald-100/60 dark:bg-emerald-900/30 tabular-nums">
              ${L(x,1)}
            </span>
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap bg-blue-50/30 dark:bg-blue-950/10">
            <span class="font-mono font-bold text-xs px-1.5 py-0.5 rounded-md tabular-nums ${C}">
              ${L(w,1)}
            </span>
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
            ${S(Number(h.unit_price)||0)}
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
            ${S(Number(h.total_value)||0)}
          </td>
          <td class="px-1.5 py-2 text-center whitespace-nowrap">
            <button onclick="openWhItemBatchesModal('${h.sku}')" class="px-1.5 py-0.5 rounded-lg text-xs font-semibold font-mono transition-all ${v>0?"bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-200 border border-purple-200/80 dark:border-purple-800/80":"bg-gray-100 text-gray-400 dark:bg-gray-800 hover:text-gray-600"}" title="Xem chi ti\u1EBFt c\xE1c l\xF4 h\xE0ng">
              ${v>0?v+" L\xF4":"0 L\xF4"}
            </button>
          </td>
          <td class="px-2 py-2 text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1 justify-center">
              <button onclick="openWhItemHistoryModal('${h.sku}')" class="px-1.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-0.5 transition-all" title="Xem th\u1EBB kho l\u1ECBch s\u1EED xu\u1EA5t nh\u1EADp">
                <i data-lucide="history" class="w-3 h-3"></i> Th\u1EBB Kho
              </button>
              <button onclick="openWhItemBatchesModal('${h.sku}')" class="px-1.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold rounded-lg border border-purple-200 dark:border-purple-800/60 flex items-center gap-0.5 transition-all" title="Xem chi ti\u1EBFt c\xE1c l\xF4 \u0111\xE3 nh\u1EADp">
                <i data-lucide="layers" class="w-3 h-3"></i> L\xF4
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),p&&(p.innerHTML=e.map((h,g)=>{let x=parseFloat(String(h.receipt_qty||0)),w=parseFloat(String(h.book_qty||0)),v=parseInt(String(h.batch_count||0),10);return`
        <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-xs font-mono">#${g+1}</span>
                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${h.sku}</span>
                <span class="px-1.5 py-0.2 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">${h.unit||"Ph\u1EA7n"}</span>
              </div>
              <h4 class="font-bold text-xs text-gray-900 dark:text-white mt-1 leading-snug">${h.name||h.sku}</h4>
              <div class="text-xs text-gray-500 mt-0.5">${h.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}</div>
            </div>
            <button onclick="openWhItemBatchesModal('${h.sku}')" class="px-2 py-1 rounded-lg text-xs font-bold font-mono ${v>0?"bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300":"bg-gray-100 text-gray-400 dark:bg-gray-800"}">
              ${v>0?v+" L\xF4":"0 L\xF4"}
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 text-xs border border-gray-100 dark:border-gray-800">
            <div>
              <span class="text-xs text-emerald-700 dark:text-emerald-400 block font-semibold">\u0110\xE3 Nh\u1EADp Kho</span>
              <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">${L(x,1)}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">T\u1ED3n S\u1ED5 S\xE1ch</span>
              <span class="font-mono font-bold tabular-nums ${w<0?"text-rose-600":"text-gray-900 dark:text-white"}">${L(w,1)}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Gi\xE1 Tr\u1ECB T\u1ED3n</span>
              <span class="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums text-xs">${S(Number(h.total_value)||0)}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <button onclick="openWhItemHistoryModal('${h.sku}')" class="w-full py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="history" class="w-3.5 h-3.5"></i> Th\u1EBB Kho Xu\u1EA5t Nh\u1EADp
            </button>
            <button onclick="openWhItemBatchesModal('${h.sku}')" class="w-full py-2 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold rounded-xl border border-purple-200 dark:border-purple-800/60 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="layers" class="w-3.5 h-3.5"></i> Chi Ti\u1EBFt L\xF4 H\xE0ng
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}async function qe(){let t=document.getElementById("whInvSiteSelect"),o=localStorage.getItem("orbit_user_site"),a=document.getElementById("globalBranchSelect")?.value,e=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,n=o||a||e||(t?t.value:null)||"K001";if((n==="ALL"||n==="all")&&(n="K001"),n=n.toUpperCase(),t){if(!t.options||t.options.length<=1){let d=typeof window.getAppSitesList=="function"?window.getAppSitesList():[];t.innerHTML=d.map(c=>`<option value="${c.code}">${c.ten||c.name}</option>`).join("")}t.value=n}let s=document.getElementById("whInvCurrentSiteBadge");if(s){let c=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(u=>u.code&&u.code.toUpperCase()===n.toUpperCase());s.textContent=c?c.ten||c.name:n}let r=n,i=document.getElementById("whInventoryTableBody"),l=document.getElementById("whInventoryMobileCards");i&&(i.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u t\u1ED3n kho WMS...</td></tr>'),l&&(l.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u t\u1ED3n kho WMS...</div>');try{let c=await(await fetch(`/api/wh/inventory?site=${encodeURIComponent(r)}&nocache=1`)).json();if(c.success){P=c.data||[],typeof window<"u"&&(window.gWhInventoryData=P);let u=document.getElementById("whInvCategorySelect");if(u){let m=u.value,f=Array.from(new Set(P.map(y=>y.category).filter(Boolean))).sort();u.innerHTML='<option value="">T\u1EA5t c\u1EA3 nh\xF3m ng\xE0nh</option>'+f.map(y=>`<option value="${y}">${y}</option>`).join(""),m&&f.includes(m)&&(u.value=m)}Ve()}else i&&(i.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500">L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u: ${c.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</td></tr>`)}catch(d){console.error("loadWhInventory error:",d),i&&(i.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${d.message}</td></tr>`)}}var et=null,It=null;function ui(){return et}function pi(){return It}async function Xo(t){let o=(P||[]).find(u=>u.sku===t)||{sku:t,name:t,unit:"Ph\u1EA7n"},a=document.getElementById("whInvSiteSelect"),e=a?a.value:"ALL",n=document.getElementById("histItemSku");n&&(n.textContent=o.sku);let s=document.getElementById("histItemName");s&&(s.textContent=o.name||o.sku);let r=document.getElementById("histItemUnit");r&&(r.textContent=o.unit||"Ph\u1EA7n");let i=document.getElementById("histItemSite");i&&(i.textContent=e==="ALL"?"To\xE0n H\u1EC7 Th\u1ED1ng":e);let l=document.getElementById("modalWhItemHistory");l&&l.classList.remove("hidden");let d=document.getElementById("whHistTableBody"),c=document.getElementById("whHistMobileCards");d&&(d.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">\u0110ang truy xu\u1EA5t th\u1EBB kho t\u1EEB h\u1EC7 th\u1ED1ng...</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">\u0110ang truy xu\u1EA5t th\u1EBB kho...</div>');try{let m=await(await fetch(`/api/wh/item-history?sku=${encodeURIComponent(t)}&site=${encodeURIComponent(e)}&nocache=1`)).json();if(m.success){et=m.data,typeof window<"u"&&(window.gWhActiveHistory=et);let f=m.data.history||[],y=document.getElementById("histTotalIn");y&&(y.textContent=L(m.data.total_in||0,1));let p=document.getElementById("histTotalOut");p&&(p.textContent=L(m.data.total_out||0,1));let h=document.getElementById("histRowCount");if(h&&(h.textContent=L(f.length,0)),!f.length){d&&(d.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Ch\u01B0a ghi nh\u1EADn giao d\u1ECBch xu\u1EA5t nh\u1EADp n\xE0o cho m\xE3 h\xE0ng n\xE0y t\u1EA1i \u0111i\u1EC3m \u0111\xE3 ch\u1ECDn.</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Ch\u01B0a ghi nh\u1EADn giao d\u1ECBch xu\u1EA5t nh\u1EADp n\xE0o.</div>');return}d&&(d.innerHTML=f.map(g=>{let x=parseFloat(String(g.qty_in||0)),w=parseFloat(String(g.qty_out||0)),v="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";return g.trans_type==="NHAP_KHO"?v="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200":g.trans_type==="XUAT_HUY"?v="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200":g.trans_type==="DIEU_CHUYEN"?v="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200":g.trans_type==="XUAT_KHO"&&(v="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"),`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="p-2.5 text-center whitespace-nowrap font-mono tabular-nums text-gray-600 dark:text-gray-300">${g.doc_date?String(g.doc_date).split("T")[0]:"\u2014"}</td>
              <td class="p-2.5 whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white">${g.doc_no||"\u2014"}</td>
              <td class="p-2.5 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${v}">${g.trans_name||g.trans_type}</span>
              </td>
              <td class="p-2.5 whitespace-nowrap font-mono text-xs text-gray-600 dark:text-gray-300">
                ${g.batch_code?`<b class="text-purple-600 dark:text-purple-400">${g.batch_code}</b>`:"\u2014"}
                ${g.exp_date?`<span class="text-gray-400 block text-xs">HSD: ${String(g.exp_date).split("T")[0]}</span>`:""}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${x>0?`+${L(x,1)}`:"\u2014"}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                ${w>0?`-${L(w,1)}`:"\u2014"}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
                ${S(Number(g.unit_price)||0)}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
                ${S(Number(g.amount)||0)}
              </td>
              <td class="p-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300 max-w-[150px] truncate" title="${g.partner_name||""}">
                ${g.partner_name||"\u2014"}
              </td>
              <td class="p-2.5 text-gray-500 dark:text-gray-400 max-w-[200px] truncate" title="${g.notes||""}">
                ${g.notes||"\u2014"}
              </td>
            </tr>
          `}).join("")),c&&(c.innerHTML=f.map(g=>{let x=parseFloat(String(g.qty_in||0)),w=parseFloat(String(g.qty_out||0)),v=g.doc_date?String(g.doc_date).split("T")[0]:"\u2014";return`
            <div class="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <div class="font-mono font-bold text-gray-900 dark:text-white">${g.doc_no||"\u2014"}</div>
                <span class="text-xs text-gray-400 font-mono">${v}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-gray-300">${g.trans_name||g.trans_type}</span>
                <span class="font-mono font-bold ${x>0?"text-emerald-600":"text-rose-600"}">
                  ${x>0?`+${L(x,1)}`:`-${L(w,1)}`} ${o.unit||""}
                </span>
              </div>
              ${g.batch_code?`<div class="text-xs text-purple-600 dark:text-purple-400 font-mono">L\xF4: <b>${g.batch_code}</b> ${g.exp_date?"\u2022 HSD: "+String(g.exp_date).split("T")[0]:""}</div>`:""}
              ${g.partner_name?`<div class="text-xs text-gray-500">\u0110\u1ED1i t\xE1c: ${g.partner_name}</div>`:""}
              ${g.notes?`<div class="text-xs text-gray-400 italic">${g.notes}</div>`:""}
            </div>
          `}).join(""))}else d&&(d.innerHTML=`<tr><td colspan="10" class="p-8 text-center text-rose-500">L\u1ED7i: ${m.error}</td></tr>`)}catch(u){console.error("openWhItemHistoryModal error:",u),d&&(d.innerHTML=`<tr><td colspan="10" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${u.message}</td></tr>`)}}async function Ko(t){let o=(P||[]).find(u=>u.sku===t)||{sku:t,name:t,unit:"Ph\u1EA7n"},a=document.getElementById("whInvSiteSelect"),e=a?a.value:"ALL",n=document.getElementById("batchItemSku");n&&(n.textContent=o.sku);let s=document.getElementById("batchItemName");s&&(s.textContent=o.name||o.sku);let r=document.getElementById("batchItemUnit");r&&(r.textContent=o.unit||"Ph\u1EA7n");let i=document.getElementById("batchItemSite");i&&(i.textContent=e==="ALL"?"To\xE0n H\u1EC7 Th\u1ED1ng":e);let l=document.getElementById("modalWhItemBatches");l&&l.classList.remove("hidden");let d=document.getElementById("whBatchesTableBody"),c=document.getElementById("whBatchesMobileCards");d&&(d.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400">\u0110ang truy v\u1EA5n danh s\xE1ch l\xF4 date FEFO...</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">\u0110ang truy v\u1EA5n l\xF4 date...</div>');try{let m=await(await fetch(`/api/wh/item-batches?sku=${encodeURIComponent(t)}&site=${encodeURIComponent(e)}&nocache=1`)).json();if(m.success){It=m.data,typeof window<"u"&&(window.gWhActiveBatches=It);let f=m.data.batches||[],y=0,p=0;f.forEach(w=>{w.status==="GOOD"?y++:p++});let h=document.getElementById("batchTotalCount");h&&(h.textContent=L(f.length,0));let g=document.getElementById("batchSafeCount");g&&(g.textContent=L(y,0));let x=document.getElementById("batchWarnCount");if(x&&(x.textContent=L(p,0)),!f.length){d&&(d.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400">Ch\u01B0a c\xF3 l\xF4 h\xE0ng date ri\xEAng bi\u1EC7t n\xE0o \u0111\u01B0\u1EE3c ghi nh\u1EADn cho m\xE3 n\xE0y (\u0111ang qu\u1EA3n l\xFD t\u1ED3n g\u1ED9p theo site).</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Ch\u01B0a c\xF3 l\xF4 h\xE0ng date ri\xEAng bi\u1EC7t.</div>');return}d&&(d.innerHTML=f.map(w=>{let v="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200",C="C\xF2n h\u1EA1n an to\xE0n";w.status==="EXPIRED"?(v="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200",C="\u0110\xE3 h\u1EBFt h\u1EA1n"):w.status==="NEAR_EXPIRY"&&(v="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200",C="C\u1EADn date (\u2264 30 ng\xE0y)");let E=w.exp_date?String(w.exp_date).split("T")[0]:"\u2014",_=w.days_left!==999?`${w.days_left} ng\xE0y`:"\u2014";return`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="p-2.5 whitespace-nowrap font-mono font-bold text-purple-700 dark:text-purple-400">${w.batch_code||"L\xD4-CHUNG"}</td>
              <td class="p-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300">
                <span>${w.site_code||""}</span> \u2022 <span class="text-gray-400">${w.storage_loc||"K\u1EC7 B\u1EBFp"}</span>
              </td>
              <td class="p-2.5 text-center whitespace-nowrap font-mono font-semibold text-gray-800 dark:text-gray-200 tabular-nums">${E}</td>
              <td class="p-2.5 text-center whitespace-nowrap font-mono tabular-nums font-semibold ${w.status==="EXPIRED"?"text-rose-600":w.status==="NEAR_EXPIRY"?"text-amber-600":"text-emerald-600"}">
                ${_}
              </td>
              <td class="p-2.5 text-center whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${v}">${C}</span>
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
                ${L(Number(w.initial_qty)||0,1)}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                ${L(Number(w.current_qty)||0,1)}
              </td>
              <td class="p-2.5 whitespace-nowrap font-mono text-gray-500 text-xs">
                ${w.receipt_code?`<span class="text-brand-600 font-semibold">${w.receipt_code}</span>`:"\u2014"}
              </td>
            </tr>
          `}).join("")),c&&(c.innerHTML=f.map(w=>{let v=w.exp_date?String(w.exp_date).split("T")[0]:"\u2014";return`
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
                <div>SL Nh\u1EADp: <b class="font-mono text-gray-900 dark:text-white">${L(Number(w.initial_qty)||0,1)}</b></div>
                <div>SL T\u1ED3n: <b class="font-mono font-bold text-blue-600 dark:text-blue-400">${L(Number(w.current_qty)||0,1)}</b></div>
              </div>
              ${w.receipt_code?`<div class="text-xs text-gray-400">Ch\u1EE9ng t\u1EEB: ${w.receipt_code}</div>`:""}
            </div>
          `}).join(""))}else d&&(d.innerHTML=`<tr><td colspan="8" class="p-8 text-center text-rose-500">L\u1ED7i: ${m.error}</td></tr>`)}catch(u){console.error("openWhItemBatchesModal error:",u),d&&(d.innerHTML=`<tr><td colspan="8" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${u.message}</td></tr>`)}}var nt=[],ot=null;function fi(){return nt}function Uo(t){let o=document.getElementById("whInvTabBtnBalance"),a=document.getElementById("whInvTabBtnReceipts"),e=document.getElementById("whInvBalanceView"),n=document.getElementById("whInvReceiptsView");t==="balance"?(o&&(o.className="btn btn-primary btn-sm"),a&&(a.className="btn btn-secondary btn-sm"),e&&e.classList.remove("hidden"),n&&n.classList.add("hidden")):(o&&(o.className="btn btn-secondary btn-sm"),a&&(a.className="btn btn-primary btn-sm"),e&&e.classList.add("hidden"),n&&n.classList.remove("hidden"),ne()),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Xe(){let t=document.getElementById("whReceivedOrdersSiteFilter");if(!t||t.options&&t.options.length>1)return;let o=typeof window.getAppSitesList=="function"?window.getAppSitesList():[];t.innerHTML=o.map(e=>`<option value="${e.code}">${e.ten||e.name}</option>`).join("");let a=localStorage.getItem("orbit_user_site")||(typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():"K001");a&&(t.value=a.toUpperCase())}function ee(){let t=document.getElementById("whReceivedOrdersTableBody"),o=document.getElementById("whReceivedOrdersMobileCards"),a=(document.getElementById("whReceivedOrdersSearchInput")?.value||"").trim().toLowerCase(),e=document.getElementById("whReceivedOrdersTypeFilter")?.value||"ALL",n=[...nt];e!=="ALL"&&(n=n.filter(u=>u.doc_type===e)),a&&(n=n.filter(u=>(u.po_number||"").toLowerCase().includes(a)||(u.receipt_code||"").toLowerCase().includes(a)||(u.supplier||"").toLowerCase().includes(a)||(u.site_code||"").toLowerCase().includes(a)||(u.notes||"").toLowerCase().includes(a)||(u.created_by||"").toLowerCase().includes(a)));let s=document.getElementById("whKpiReceivedOrdersCount"),r=document.getElementById("whKpiReceivedOrdersTotalQty"),i=document.getElementById("whKpiReceivedOrdersTotalAmount"),l=document.getElementById("whReceivedOrdersCountText"),d=0,c=0;if(n.forEach(u=>{d+=Number(u.total_qty)||0,c+=Number(u.total_amount)||0}),s&&(s.textContent=String(n.length)),r&&(r.textContent=L(d,1)),i&&(i.textContent=Math.round(c).toLocaleString("vi-VN")+" \u20AB"),l&&(l.textContent=String(n.length)),!n.length){t&&(t.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}t&&(t.innerHTML=n.map((u,m)=>{let y=u.doc_type==="DIRECT"?'<span class="badge badge-neutral text-xs">Tr\u1EF1c ti\u1EBFp</span>':u.doc_type==="PR"?'<span class="badge badge-brand text-xs">\u0110\u01A1n PR</span>':'<span class="badge badge-brand text-xs">\u0110\u01A1n PO</span>',p=G(u.receipt_date),h=Math.round(Number(u.total_amount)||0).toLocaleString("vi-VN")+" \u20AB";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="w-10 text-center text-gray-400 num font-mono text-xs">${m+1}</td>
          <td class="col-code font-bold">
            <span class="code font-bold text-brand-600 dark:text-brand-400">${b(u.po_number||"\u2014")}</span>
            <div class="mt-0.5">${y}</div>
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
          <td class="col-num text-right font-bold text-gray-900 dark:text-white num text-xs">${h}</td>
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
      `}).join("")),o&&(o.innerHTML=n.map(u=>{let f=u.doc_type==="DIRECT"?'<span class="badge badge-neutral text-xs">Tr\u1EF1c ti\u1EBFp</span>':u.doc_type==="PR"?'<span class="badge badge-brand text-xs">\u0110\u01A1n PR</span>':'<span class="badge badge-brand text-xs">\u0110\u01A1n PO</span>',y=G(u.receipt_date),p=Math.round(Number(u.total_amount)||0).toLocaleString("vi-VN")+" \u20AB";return`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="code font-bold text-brand-600 dark:text-brand-400">${b(u.po_number||u.receipt_code||"")}</span>
              ${f}
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
              <span class="text-gray-600 dark:text-gray-300 font-medium">${b(u.site_code||"")} \u2022 <span class="num">${y}</span></span>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-gray-400 block">S\u1ED1 m\u1EB7t h\xE0ng</span>
                <span class="num font-bold text-gray-900 dark:text-white">${u.item_count||1} m\xF3n (${L(u.total_qty||0,1)})</span>
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
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Go(){ee()}async function ne(){Xe();let t=document.getElementById("whReceivedOrdersSiteFilter"),o=localStorage.getItem("orbit_user_site"),a=document.getElementById("globalBranchSelect")?.value,e=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,n=o||a||e||(t?t.value:null)||"K001";(n==="ALL"||n==="all")&&(n="K001"),n=n.toUpperCase(),t&&(t.value=n);let s=n,r=document.getElementById("whReceivedOrdersTableBody"),i=document.getElementById("whReceivedOrdersMobileCards");r&&(r.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">\u0110ang t\u1EA3i danh s\xE1ch \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho...</td></tr>'),i&&(i.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\u1EA3i danh s\xE1ch \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho...</div>');try{let d=await(await fetch(`/api/wh/received-orders?site=${encodeURIComponent(s)}&no-cache=1`)).json();d.success&&d.data?nt=d.data.orders||[]:nt=[],typeof window<"u"&&(window.gWhReceivedOrders=nt);let c=document.getElementById("whInvBadgeReceiptsCount");c&&(c.textContent=String(nt.length)),ee()}catch(l){console.error("loadWhReceivedOrders error:",l),r&&(r.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i danh s\xE1ch: ${l.message}</td></tr>`),i&&(i.innerHTML=`<div class="p-6 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i danh s\xE1ch: ${l.message}</div>`)}}async function Qo(t,o){let a=document.getElementById("whReceivedOrderDetailModal");if(!a)return;a.classList.remove("hidden");let e=document.getElementById("whRecModalTitle"),n=document.getElementById("whRecModalPoNumber"),s=document.getElementById("whRecModalReceiptCode"),r=document.getElementById("whRecModalSite"),i=document.getElementById("whRecModalDate"),l=document.getElementById("whRecModalSupplier"),d=document.getElementById("whRecModalCreatedBy"),c=document.getElementById("whRecModalTotalAmount"),u=document.getElementById("whRecModalLinesBody");e&&(e.textContent=`Chi ti\u1EBFt \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho: ${o||t}`),n&&(n.textContent=o||"\u2014"),u&&(u.innerHTML='<tr><td colspan="9" class="p-6 text-center text-gray-400">\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng \u0111\xE3 nh\u1EADp...</td></tr>'),ot={receiptId:t,poNumber:o},typeof window<"u"&&(window.gWhCurrentReceivedDetail=ot);try{let m=(nt||[]).find(y=>t&&String(y.id)===String(t)||o&&y.po_number===o);m&&(s&&(s.textContent=m.receipt_code||"\u2014"),r&&(r.textContent=m.site_code||"\u2014"),i&&(i.textContent=G(m.receipt_date)),l&&(l.textContent=m.supplier||"\u2014"),d&&(d.textContent=m.created_by||"Th\u1EE7 kho"),c&&(c.textContent=Math.round(Number(m.total_amount)||0).toLocaleString("vi-VN")+" \u20AB"),ot.receiptCode=m.receipt_code,ot.totalAmount=m.total_amount);let f=[];if(t){let p=await(await fetch(`/api/fnb/receipts?id=${encodeURIComponent(t)}`)).json();p.success&&p.data&&(f=p.data.lines||[])}else if(o){let p=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(o)}`)).json();p.success&&p.data&&(f=(p.data||[]).map(h=>({item_code:h.article,item_name:h.article_desc||h.article,unit:h.order_unit||"Ph\u1EA7n",qty:h.received_qty||h.order_qty,unit_price:h.net_price,amount:(h.received_qty||h.order_qty)*h.net_price,batch_code:h.batch_code||"L\xD4-SAP",exp_date:h.exp_date||null})))}if(!f.length){u&&(u.innerHTML='<tr><td colspan="9" class="p-6 text-center text-gray-400">Kh\xF4ng c\xF3 d\xF2ng h\xE0ng n\xE0o \u0111\u01B0\u1EE3c ghi nh\u1EADn cho phi\u1EBFu n\xE0y.</td></tr>');return}u&&(u.innerHTML=f.map((y,p)=>{let h=Number(y.qty)||0,g=Number(y.unit_price)||0,x=Number(y.amount)||h*g,w=y.exp_date?G(y.exp_date.slice(0,10)):"\u2014";return`
          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
            <td class="text-center num text-xs font-mono text-gray-400">${p+1}</td>
            <td class="col-code font-bold text-xs">${b(y.item_code)}</td>
            <td class="font-medium text-xs text-gray-900 dark:text-white">${b(y.item_name||y.item_code)}</td>
            <td class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300">${b(y.unit||"Ph\u1EA7n")}</td>
            <td class="col-num text-right num font-bold text-emerald-600 dark:text-emerald-400 text-xs">${L(h,1)}</td>
            <td class="col-num text-right num text-xs">${Math.round(g).toLocaleString("vi-VN")} \u20AB</td>
            <td class="col-num text-right num font-semibold text-gray-900 dark:text-white text-xs">${Math.round(x).toLocaleString("vi-VN")} \u20AB</td>
            <td class="text-center font-mono text-xs text-gray-700 dark:text-gray-300">${b(y.batch_code||"\u2014")}</td>
            <td class="col-date text-center num text-xs text-gray-600 dark:text-gray-400">${w}</td>
          </tr>
        `}).join(""))}catch(m){console.error("Error openWhReceivedOrderDetail:",m),u&&(u.innerHTML=`<tr><td colspan="9" class="p-6 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i chi ti\u1EBFt: ${m.message}</td></tr>`)}typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Ke(){let t=document.getElementById("whReceivedOrderDetailModal");t&&t.classList.add("hidden"),ot=null,typeof window<"u"&&(window.gWhCurrentReceivedDetail=null)}function zo(){if(!ot)return;let{receiptId:t,poNumber:o,receiptCode:a,totalAmount:e}=ot;Ue(t,o,a,e)}async function Ue(t,o,a,e){let n=a||o||"\u0111\u01A1n h\xE0ng n\xE0y",s=e?Math.round(e).toLocaleString("vi-VN")+" \u20AB":"",r=`B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n H\u1EE6Y NH\u1EACP KHO cho \u0111\u01A1n h\xE0ng [${n}]`+(s?` v\u1EDBi gi\xE1 tr\u1ECB ${s}`:"")+`?

\u2022 To\xE0n b\u1ED9 s\u1ED1 l\u01B0\u1EE3ng nh\u1EADp kho s\u1EBD \u0111\u01B0\u1EE3c HO\xC0N T\xC1C TR\u1EEA KH\u1ECEI T\u1ED2N KHO th\u1EF1c t\u1EBF.
\u2022 \u0110\u01A1n h\xE0ng PO/PR s\u1EBD \u0111\u01B0\u1EE3c m\u1EDF l\u1EA1i (tr\u1EA1ng th\xE1i Ch\u1EDD nh\u1EADp) \u0111\u1EC3 c\xF3 th\u1EC3 nh\u1EADp l\u1EA1i khi c\u1EA7n.`;if(confirm(r))try{typeof showLoading=="function"&&showLoading("\u0110ang h\u1EE7y nh\u1EADp kho v\xE0 ho\xE0n t\xE1c t\u1ED3n kho...");let l=await(await fetch("/api/fnb/receipts/cancel",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t||void 0,po_number:o||void 0})})).json();l.success?(typeof showToast=="function"&&showToast(l.message||"H\u1EE7y nh\u1EADp kho th\xE0nh c\xF4ng!","success"),Ke(),ne()):typeof showToast=="function"&&showToast(`L\u1ED7i h\u1EE7y nh\u1EADp kho: ${l.error}`,"error")}catch(i){console.error("confirmCancelReceivedOrder error:",i),typeof showToast=="function"&&showToast(`L\u1ED7i k\u1EBFt n\u1ED1i: ${i.message}`,"error")}finally{typeof hideLoading=="function"&&hideLoading()}}function Jo(){let t=it&&it.length?it:P;if(!t||!t.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let o=document.getElementById("whInvSiteSelect")?.value||"ALL",e=[["STT","M\xE3 SKU","T\xEAn M\u1EB7t H\xE0ng","Nh\xF3m Ng\xE0nh H\xE0ng","\u0110\u01A1n V\u1ECB T\xEDnh","S\u1ED1 L\u01B0\u1EE3ng \u0110\xE3 Nh\u1EADp","S\u1ED1 L\u01B0\u1EE3ng T\u1ED3n S\u1ED5 S\xE1ch","\u0110\u01A1n Gi\xE1 Chu\u1EA9n (VN\u0110)","T\u1ED5ng Gi\xE1 Tr\u1ECB T\u1ED3n (VN\u0110)","S\u1ED1 L\xF4 Qu\u1EA3n L\xFD","Ng\xE0y Nh\u1EADp G\u1EA7n Nh\u1EA5t","Ng\xE0y Ki\u1EC3m K\xEA G\u1EA7n Nh\u1EA5t"]];t.forEach((d,c)=>{e.push([c+1,d.sku||"",d.name||"",d.category||"",d.unit||"",parseFloat(String(d.receipt_qty||0)),parseFloat(String(d.book_qty||0)),parseFloat(String(d.unit_price||0)),parseFloat(String(d.total_value||0)),parseInt(String(d.batch_count||0),10),d.last_receipt_date?String(d.last_receipt_date).split("T")[0]:"",d.last_count_date?String(d.last_count_date).split("T")[0]:""])});let n=XLSX.utils.book_new(),s=XLSX.utils.aoa_to_sheet(e),r=XLSX.utils.decode_range(s["!ref"]);s["!cols"]=[{wch:6},{wch:14},{wch:34},{wch:18},{wch:10},{wch:16},{wch:18},{wch:18},{wch:20},{wch:14},{wch:16},{wch:18}];for(let d=r.s.r;d<=r.e.r;++d)for(let c=r.s.c;c<=r.e.c;++c){let u=XLSX.utils.encode_cell({r:d,c});if(s[u])if(d===0)s[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let m="left",f;c===0||c===1||c===4||c===9||c===10||c===11?m="center":c===5||c===6?(m="right",f="#,##0.0"):(c===7||c===8)&&(m="right",f="#,##0");let y=c===6&&typeof s[u].v=="number"&&s[u].v<0;s[u].s={font:{name:"Aptos",sz:11,bold:c===6||c===8,color:{rgb:y?"C00000":"000000"}},alignment:{horizontal:m,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},f&&(s[u].z=f)}}s["!freeze"]={xSplit:0,ySplit:1},s["!autofilter"]={ref:s["!ref"]};let i=new Date().toISOString().slice(0,10).replace(/-/g,""),l=`Ton_Kho_WMS_${o}_${i}.xlsx`;XLSX.utils.book_append_sheet(n,s,"TonKhoWMS"),XLSX.writeFile(n,l),typeof showToast=="function"&&showToast(`\u0110\xE3 xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho ${o} th\xE0nh c\xF4ng!`,"success")}function Yo(){if(!et||!et.history){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u th\u1EBB kho \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let t=et,o=t.history||[];if(!o.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 ph\xE1t sinh giao d\u1ECBch n\xE0o \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let e=[["STT","Ng\xE0y Ch\u1EE9ng T\u1EEB","S\u1ED1 Ch\u1EE9ng T\u1EEB","Lo\u1EA1i Nghi\u1EC7p V\u1EE5","M\xE3 L\xF4","H\u1EA1n D\xF9ng (HSD)","S\u1ED1 L\u01B0\u1EE3ng Nh\u1EADp (+)","S\u1ED1 L\u01B0\u1EE3ng Xu\u1EA5t (-)","\u0110\u01A1n Gi\xE1 (VN\u0110)","Th\xE0nh Ti\u1EC1n (VN\u0110)","\u0110\u1ED1i T\xE1c / Nh\xE0 Cung C\u1EA5p","Ghi Ch\xFA / Di\u1EC5n Gi\u1EA3i"]];o.forEach((d,c)=>{e.push([c+1,d.doc_date?String(d.doc_date).split("T")[0]:"",d.doc_no||"",d.trans_name||d.trans_type||"",d.batch_code||"",d.exp_date?String(d.exp_date).split("T")[0]:"",parseFloat(String(d.qty_in||0)),parseFloat(String(d.qty_out||0)),parseFloat(String(d.unit_price||0)),parseFloat(String(d.amount||0)),d.partner_name||"",d.notes||""])});let n=XLSX.utils.book_new(),s=XLSX.utils.aoa_to_sheet(e),r=XLSX.utils.decode_range(s["!ref"]);s["!cols"]=[{wch:6},{wch:14},{wch:16},{wch:16},{wch:14},{wch:14},{wch:16},{wch:16},{wch:16},{wch:18},{wch:28},{wch:30}];for(let d=r.s.r;d<=r.e.r;++d)for(let c=r.s.c;c<=r.e.c;++c){let u=XLSX.utils.encode_cell({r:d,c});if(s[u])if(d===0)s[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let m="left",f;c===0||c===1||c===2||c===3||c===4||c===5?m="center":c===6||c===7?(m="right",f="#,##0.0"):(c===8||c===9)&&(m="right",f="#,##0"),s[u].s={font:{name:"Aptos",sz:11,bold:c===6||c===7,color:{rgb:"000000"}},alignment:{horizontal:m,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},f&&(s[u].z=f)}}s["!freeze"]={xSplit:0,ySplit:1},s["!autofilter"]={ref:s["!ref"]};let i=new Date().toISOString().slice(0,10).replace(/-/g,""),l=`The_Kho_${t.sku}_${t.site}_${i}.xlsx`;XLSX.utils.book_append_sheet(n,s,"TheKho"),XLSX.writeFile(n,l),typeof showToast=="function"&&showToast(`\u0110\xE3 xu\u1EA5t th\u1EBB kho m\xE3 ${t.sku} th\xE0nh c\xF4ng!`,"success")}if(typeof window<"u"){let t=window;t.gWhInventoryData=P,t.gWhFilteredInventory=it,t.gWhActiveHistory=et,t.gWhActiveBatches=It,t.gWhReceivedOrders=nt,t.gWhCurrentReceivedDetail=ot,t.loadWhInventory=qe,t.loadPoSap=qe,t.filterWhInventoryTable=Ve,t.openWhItemHistoryModal=Xo,t.openWhItemBatchesModal=Ko,t.switchWhInvSubView=Uo,t.populateWhReceivedOrdersSiteFilter=Xe,t.loadWhReceivedOrders=ne,t.filterWhReceivedOrdersTable=Go,t.renderWhReceivedOrdersTable=ee,t.openWhReceivedOrderDetail=Qo,t.closeWhReceivedOrderDetailModal=Ke,t.onWhRecModalCancelClick=zo,t.confirmCancelReceivedOrder=Ue,t.exportWhInventoryToExcel=Jo,t.exportWhItemHistoryToExcel=Yo}var j=[],Mt="ALL";async function Zo(){let t=document.getElementById("btnSyncFnbMonthly"),o=document.getElementById("iconSyncFnbMonthly"),a=document.getElementById("labelSyncFnbMonthly");try{t&&(t.disabled=!0),o&&o.classList.add("animate-spin"),a&&(a.textContent="\u0110ang \u0111\u1ED3ng b\u1ED9...");let n=document.getElementById("globalMonthPicker")?.value||new Date().toISOString().slice(0,7),r=await(await fetch("/api/fnb/chain/sync-monthly",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({month:n})})).json();r.success?(typeof showToast=="function"&&showToast(`\u0110\xE3 \u0111\u1ED3ng b\u1ED9 s\u1ED1 li\u1EC7u th\xE1ng ${n} th\xE0nh c\xF4ng (${r.count||14} \u0111i\u1EC3m b\xE1n)!`,"success"),await Ge()):typeof showToast=="function"&&showToast("L\u1ED7i \u0111\u1ED3ng b\u1ED9: "+(r.error||"Kh\xF4ng th\xE0nh c\xF4ng"),"error")}catch(e){console.error("triggerSyncFnbMonthlySummary error:",e),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi \u0111\u1ED3ng b\u1ED9: "+e.message,"error")}finally{t&&(t.disabled=!1),o&&o.classList.remove("animate-spin"),a&&(a.textContent="\u0110\u1ED3ng b\u1ED9 s\u1ED1 li\u1EC7u"),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}async function Ge(){try{typeof showLoading=="function"&&showLoading();let o=document.getElementById("globalMonthPicker")?.value||"2026-11",e=await(await fetch(`/api/fnb/chain?month=${encodeURIComponent(o)}`)).json();if(e.success&&e.data){let n=e.data;j=n.rankings||[],typeof renderKpi=="function"&&(renderKpi("chainTotalRevenue",{value:n.totalChainRevenue,sub:"14 \u0110i\u1EC3m b\xE1n to\xE0n h\u1EC7 th\u1ED1ng A.Kitchen"}),renderKpi("chainTotalProfit",{value:n.totalChainProfit,sub:"L\u1EE3i nhu\u1EADn g\u1ED9p to\xE0n chu\u1ED7i"}),renderKpi("chainAvgFoodCost",{text:`${n.avgFoodCostPct}%`,sub:"d\u01B0\u1EDBi ng\u01B0\u1EE1ng 43%",deltaGood:n.avgFoodCostPct<=43}),renderKpi("chainAvgLaborCost",{text:`${n.avgLaborCostPct}%`,sub:"d\u01B0\u1EDBi ng\u01B0\u1EE1ng 19%",deltaGood:n.avgLaborCostPct<=19}));let s=document.getElementById("chainAvgMargin");s&&(s.textContent=`${n.avgChainMargin}%`),$t(j)}}catch(t){console.error("Error loadFnbChain:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u to\xE0n chu\u1ED7i: "+t.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function $t(t){let o=document.getElementById("fnbChainTableBody"),a=document.getElementById("fnbChainMobileCards"),e=t||j;if(!e||e.length===0){o&&(o.innerHTML='<tr><td colspan="11" class="text-center py-8 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111i\u1EC3m b\xE1n n\xE0o ph\xF9 h\u1EE3p.</td></tr>'),a&&(a.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111i\u1EC3m b\xE1n n\xE0o ph\xF9 h\u1EE3p.</div>');return}o&&(o.innerHTML=e.map(n=>{let s="";n.status==="V\u01AF\u1EE2T CH\u1EC8 TI\xCAU"?s='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">V\u01AF\u1EE2T CH\u1EC8 TI\xCAU</span>':n.status==="TRONG M\u1EE8C"?s='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800">TRONG M\u1EE8C</span>':n.status==="CH\u01AFA PH\xC1T SINH"?s='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">CH\u01AFA PH\xC1T SINH</span>':s='<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800">C\u1EA6N XEM X\xC9T</span>';let r="";n.rank===1?r='<span class="w-6 h-6 rounded-full bg-amber-400 text-gray-900 font-semibold inline-flex items-center justify-center text-xs shadow-xs">\u{1F947}1</span>':n.rank===2?r='<span class="w-6 h-6 rounded-full bg-gray-300 text-gray-900 font-semibold inline-flex items-center justify-center text-xs shadow-xs">\u{1F948}2</span>':n.rank===3?r='<span class="w-6 h-6 rounded-full bg-amber-700 text-white font-semibold inline-flex items-center justify-center text-xs shadow-xs">\u{1F949}3</span>':r=`<span class="tabular-nums font-mono text-gray-500 font-bold">${n.rank}</span>`;let i=parseFloat(String(n.achievementPct))||0,l=parseFloat(String(n.foodCostPct))||0;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center">${r}</td>
          <td class="py-3 px-4">
            <div class="font-bold text-gray-900 dark:text-white">${n.name}</div>
            <div class="text-xs font-mono tabular-nums text-gray-400">SAP: ${n.code}</div>
          </td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded text-xs font-bold ${n.region==="Mi\u1EC1n Nam"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300":"bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"}">${n.region}</span>
          </td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-gray-900 dark:text-white">${S(n.netRevenue)}</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums text-gray-500">${S(n.targetRevenue)}</td>
          <td class="py-3 px-3 text-center">
            <div class="font-mono tabular-nums font-bold text-gray-900 dark:text-white">${n.achievementPct}%</div>
            <div class="w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
              <div class="${i>=100?"bg-emerald-500":"bg-blue-500"} h-1.5 rounded-full" style="width: ${Math.min(100,i)}%"></div>
            </div>
          </td>
          <td class="py-3 px-3 text-center font-mono tabular-nums ${l<=43?"text-emerald-600 font-bold":"text-rose-600 font-bold"}">${n.foodCostPct}%</td>
          <td class="py-3 px-3 text-center font-mono tabular-nums text-purple-600 font-bold">${n.laborCostPct}%</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-emerald-600">${S(n.operatingProfit)}</td>
          <td class="py-3 px-3 text-center">${s}</td>
          <td class="py-3 px-3 text-center">
            <button onclick="viewSitePL('${n.code}')" class="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:hover:bg-brand-500 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all flex items-center gap-1 mx-auto">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
              <span>P&amp;L</span>
            </button>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=e.map(n=>{let s="";return n.status==="V\u01AF\u1EE2T CH\u1EC8 TI\xCAU"?s='<span class="badge badge-success text-xs">V\u01B0\u1EE3t ch\u1EC9 ti\xEAu</span>':n.status==="TRONG M\u1EE8C"?s='<span class="badge badge-brand text-xs">Trong m\u1EE9c</span>':n.status==="CH\u01AFA PH\xC1T SINH"?s='<span class="badge badge-neutral text-xs">Ch\u01B0a ph\xE1t sinh</span>':s='<span class="badge badge-danger text-xs">C\u1EA7n xem x\xE9t</span>',`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="font-bold text-brand-600 dark:text-brand-400 font-mono text-xs">#${n.rank} ${n.code}</span>
              ${s}
            </div>
            <span class="text-xs text-gray-400">${n.region}</span>
          </div>
          <div class="data-card-body space-y-2">
            <div class="font-bold text-sm text-gray-900 dark:text-white">${n.name}</div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span class="text-gray-400">Doanh thu:</span>
                <span class="font-mono font-bold text-gray-900 dark:text-white ml-1">${S(n.netRevenue)}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400">\u0110\u1EA1t ch\u1EC9 ti\xEAu:</span>
                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 ml-1">${n.achievementPct}%</span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-1 text-xs text-center pt-1 border-t border-gray-100 dark:border-gray-800">
              <div>
                <div class="text-gray-400 text-[10px]">Food Cost</div>
                <div class="font-mono font-bold ${parseFloat(String(n.foodCostPct))<=43?"text-emerald-600":"text-rose-600"}">${n.foodCostPct}%</div>
              </div>
              <div>
                <div class="text-gray-400 text-[10px]">Labor Cost</div>
                <div class="font-mono font-bold text-purple-600">${n.laborCostPct}%</div>
              </div>
              <div>
                <div class="text-gray-400 text-[10px]">EBITDA</div>
                <div class="font-mono font-bold text-emerald-600">${S(n.operatingProfit)}</div>
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewSitePL('${n.code}')" class="btn btn-secondary btn-sm">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> Xem P&L
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function ta(t){Mt=t,["filterRegALL","filterRegMN","filterRegMB"].forEach(n=>{let s=document.getElementById(n);s&&(s.classList.remove("bg-brand-500","text-white","shadow-xs","font-bold"),s.classList.add("font-medium","text-gray-600","dark:text-gray-300"))});let o=t==="ALL"?"filterRegALL":t==="Mi\u1EC1n Nam"?"filterRegMN":"filterRegMB",a=document.getElementById(o);a&&(a.classList.remove("font-medium","text-gray-600","dark:text-gray-300"),a.classList.add("bg-brand-500","text-white","shadow-xs","font-bold"));let e=j;t!=="ALL"&&(e=j.filter(n=>n.region===t)),$t(e)}function ea(t){let o=String(t||"").toLowerCase().trim(),a=j;Mt!=="ALL"&&(a=a.filter(e=>e.region===Mt)),o&&(a=a.filter(e=>e.code.toLowerCase().includes(o)||e.name.toLowerCase().includes(o)||e.region.toLowerCase().includes(o))),$t(a)}var bt=null;function na(t){let o=document.getElementById("plSiteSelector");o&&(o.value=t);let a=document.getElementById("globalBranchSelect");a&&(a.value=t),typeof window.switchTab=="function"&&window.switchTab("fnb-pl"),oe()}async function oe(){try{typeof showLoading=="function"&&showLoading();let o=document.getElementById("globalBranchSelect")?.value||localStorage.getItem("orbit_user_site")||"K001",e=document.getElementById("globalMonthPicker")?.value||"2026-11",s=await(await fetch(`/api/fnb/pl?site=${encodeURIComponent(o)}&thang=${encodeURIComponent(e)}`)).json();if(s.success&&s.data){bt=s.data,typeof window<"u"&&(window.currentPLData=bt);let r=document.getElementById("plSiteSelector");r&&s.data.siteCode&&(r.value=s.data.siteCode),ze(s.data);let i=document.getElementById("plFocusFilter")?.value||"ALL";Qe(i)}}catch(t){console.error("Error loadFnbPL:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i P&L: "+t.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Qe(t){let o=document.querySelector("#fnb-pl table tbody");if(!o)return;o.querySelectorAll("tr").forEach(e=>{let n=(e.textContent||"").toLowerCase();!t||t==="ALL"?e.style.display="":t==="COGS"?n.includes("gi\xE1 v\u1ED1n")||n.includes("food cost")||n.includes("nguy\xEAn v\u1EADt li\u1EC7u")||n.includes("doanh thu thu\u1EA7n")?e.style.display="":e.style.display="none":t==="LABOR"?n.includes("nh\xE2n s\u1EF1")||n.includes("labor")||n.includes("qu\u1EF9 l\u01B0\u01A1ng")||n.includes("doanh thu thu\u1EA7n")?e.style.display="":e.style.display="none":t==="OPEX"?n.includes("v\u1EADn h\xE0nh")||n.includes("thu\xEA")||n.includes("\u0111i\u1EC7n")||n.includes("c\u1ED1 \u0111\u1ECBnh")||n.includes("doanh thu thu\u1EA7n")?e.style.display="":e.style.display="none":t==="EBITDA"&&(n.includes("ebitda")||n.includes("l\u1EE3i nhu\u1EADn")||n.includes("doanh thu thu\u1EA7n")?e.style.display="":e.style.display="none")})}function ze(t){if(!t)return;let o=document.getElementById("plSiteTitle");o&&(o.textContent=`B\xE1o C\xE1o P&L: ${t.site}`);let a=t.targetRevenue>0?t.netRevenue/t.targetRevenue*100:0;typeof renderKpi=="function"&&renderKpi("plNetRev",{value:t.netRevenue,sub:"Doanh thu sau chi\u1EBFt kh\u1EA5u"});let e=document.getElementById("plAchievement");if(e){let g=a>0?`${a.toFixed(1)}%`:"0,0%",x=a>=100;e.className=x?"kpi-delta-good":"kpi-delta-bad",e.innerHTML=`<svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="${x?"M12 19V5m0 0l-6 6m6-6l6 6":"M12 5v14m0 0l-6-6m6 6l6-6"}"/></svg><span class="font-mono tabular-nums">${g}</span><span class="sr-only">${x?"\u0111\u1EA1t":"ch\u01B0a \u0111\u1EA1t"}</span>`}let n=t.netRevenue>0?t.foodCost/t.netRevenue*100:0,s=t.netRevenue>0?t.laborCost/t.netRevenue*100:0,r=t.netRevenue>0?t.primeCost/t.netRevenue*100:0;typeof renderKpi=="function"&&renderKpi("plPrimeCostPct",{text:`${r.toFixed(1)}%`,sub:"M\u1EE5c ti\xEAu \u2264 62,0%",progress:Math.min(100,r/62*100)});let i=document.getElementById("plPrimeCostBar");i&&(i.style.width=`${Math.min(100,r/62*100)}%`,i.className=r>62?"kpi-progress-bar-error":"kpi-progress-bar");let l=document.getElementById("plFoodCostPct");l&&(l.textContent=`${n.toFixed(1)}%`);let d=document.getElementById("plFoodCostVal");d&&(d.textContent=S(t.foodCost));let c=document.getElementById("plLaborCostPct");c&&(c.textContent=`${s.toFixed(1)}%`);let u=document.getElementById("plLaborCostVal");u&&(u.textContent=S(t.laborCost)),typeof renderKpi=="function"&&(renderKpi("plProfitVal",{value:t.operatingProfit,sub:"L\u1EE3i nhu\u1EADn ho\u1EA1t \u0111\u1ED9ng"}),renderKpi("plBreakEven",{value:t.breakEvenRevenue,sub:"C\u1ED1 \u0111\u1ECBnh th\xE1ng"}));let m=document.getElementById("plProfitMargin");if(m){let g=t.profitMargin>=20;m.className=g?"kpi-delta-good":t.profitMargin>=0?"kpi-delta-neutral":"kpi-delta-bad",m.innerHTML=`<span class="font-mono tabular-nums">${t.profitMargin}%</span>`}let f=(g,x)=>{let w=document.getElementById(g);w&&(w.textContent=x)};f("plRowGross",S(t.grossRevenue)),f("plRowDiscount","-"+S(t.discount)),f("plRowNet",S(t.netRevenue)),t.channels&&(f("plRowDineIn",S(t.channels.dineIn)),f("plRowTakeaway",S(t.channels.takeaway)),f("plRowCatering",S(t.channels.catering))),f("plRowFoodCost",S(t.foodCost)),f("plRowFoodCostPct",t.netRevenue>0?`${(t.foodCost/t.netRevenue*100).toFixed(1)}%`:"0.0%"),f("plRowLaborCost",S(t.laborCost)),f("plRowLaborCostPct",t.netRevenue>0?`${(t.laborCost/t.netRevenue*100).toFixed(1)}%`:"0.0%"),f("plRowPrimeCost",S(t.primeCost)),f("plRowPrimeCostPct",t.netRevenue>0?`${(t.primeCost/t.netRevenue*100).toFixed(1)}%`:"0.0%"),f("plRowRent",S(t.rentCost)),f("plRowUtilities",S(t.utilityCost)),f("plRowSupplies",S(t.supplyCost)),f("plRowWaste",S(t.wasteCost)),f("plRowMarketing",S(t.marketingCost)),f("plRowTotalCost",S(t.totalCost)),f("plRowEBITDA",S(t.operatingProfit)),f("plRowEBITDAPct",`${t.profitMargin}%`);let y=document.getElementById("plWeeklyTrendBody");y&&t.weeklyTrends&&(y.innerHTML=t.weeklyTrends.map(g=>`
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30">
        <td class="py-1 px-2 font-bold font-mono text-xs">${g.week}</td>
        <td class="py-1 px-2 text-right font-mono text-xs">${S(g.netRevenue||g.netRev||0)}</td>
        <td class="py-1 px-2 text-center text-blue-600 font-bold font-mono text-xs">${g.foodCostPct}%</td>
        <td class="py-1 px-2 text-center text-purple-600 font-bold font-mono text-xs">${g.laborCostPct}%</td>
        <td class="py-1 px-2 text-right text-emerald-600 font-bold font-mono text-xs">${g.profitMargin||g.profitPct||0}%</td>
      </tr>
    `).join("")),t.opMetrics&&(f("plOpBillCount",`${t.opMetrics.avgDailyBills||0} bill`),f("plOpAvgBill",S(t.opMetrics.avgSpendPerBill||0)),f("plOpRevSeat",S(t.opMetrics.revenuePerSeatPerDay||0)),f("plOpOccupancy",`${t.opMetrics.peakOccupancyPct||78.5}%`));let p=document.getElementById("plTopDishesList");p&&t.topDishes&&(t.topDishes.length===0?p.innerHTML='<div class="text-xs text-gray-400 py-2 text-center">Ch\u01B0a ph\xE1t sinh m\xF3n trong k\u1EF3</div>':p.innerHTML=t.topDishes.map((g,x)=>`
        <div class="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/40">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950 text-brand-500 font-bold text-xs flex items-center justify-center font-mono">${x+1}</span>
            <span class="font-bold text-gray-800 dark:text-gray-200">${g.name}</span>
          </div>
          <div class="flex items-center gap-3 font-mono tabular-nums text-xs">
            <span class="text-gray-500">${g.qty} su\u1EA5t</span>
            <span class="font-bold text-gray-900 dark:text-white">${S(g.revenue||g.rev||0)}</span>
          </div>
        </div>
      `).join(""));let h=document.getElementById("plActionPlansList");h&&t.actionPlans&&(h.innerHTML=t.actionPlans.map(g=>`
      <div class="flex items-start gap-2 py-0.5">
        <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"></i>
        <span>${typeof g=="object"?g.task||JSON.stringify(g):g}</span>
      </div>
    `).join(""))}function oa(t){let o=document.getElementById("globalBranchSelect");o&&(o.value=t),oe()}async function aa(){try{typeof showLoading=="function"&&showLoading();let t=document.getElementById("globalBranchSelect")?.value||"K001",o=document.getElementById("posDatePicker"),a=o?.value||"2026-11-19",n=await(await fetch(`/api/fnb/pos?site=${encodeURIComponent(t)}&date=${encodeURIComponent(a)}`)).json();n.success&&n.data&&(n.data.date&&o&&o.value!==n.data.date&&(o.value=n.data.date),Je(n.data))}catch(t){console.error("Error loadFnbPOS:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i POS: "+t.message,"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function Je(t){if(!t)return;typeof renderKpi=="function"&&(renderKpi("posDailyRevenue",{value:t.dailyRevenue||t.totalSalesToday||0,sub:"so v\u1EDBi TB tu\u1EA7n"}),renderKpi("posDailyBills",{value:t.totalBills||t.billsToday||0,unit:"bill",isCurrency:!1,sub:"S\u1ED1 giao d\u1ECBch thanh to\xE1n"}),renderKpi("posDailyAOV",{value:t.avgSpendPerBill||t.avgBillToday||0,sub:"Su\u1EA5t tr\u01B0a c\xF4ng s\u1EDF"}));let o=document.getElementById("posHourlyList");o&&t.hourlyDistribution&&(o.innerHTML=t.hourlyDistribution.map(a=>`
      <div>
        <div class="flex justify-between font-bold mb-1 font-mono text-xs">
          <span>${a.hour} (${a.bills} bills)</span>
          <span class="tabular-nums">${S(a.revenue||a.sales||0)} (${a.pct}%)</span>
        </div>
        <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
          <div class="bg-brand-500 h-2 rounded-full" style="width: ${a.pct}%"></div>
        </div>
      </div>
    `).join(""))}async function ra(){try{typeof showLoading=="function"&&showLoading();let o=await(await fetch("/api/branches")).json();if(o.success&&Array.isArray(o.data)&&o.data.length>0)_t(o.data);else{let a=(typeof getAppSitesList=="function"?getAppSitesList():[]).filter(e=>e.code!=="ALL");_t(a)}}catch(t){console.error("Error loadFnbSites:",t);let o=(typeof getAppSitesList=="function"?getAppSitesList():[]).filter(a=>a.code!=="ALL");_t(o)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}}function _t(t){let o=document.getElementById("fnbSitesMasterTableBody"),a=document.getElementById("fnbSitesMobileCards");if(!t)return;let e=document.getElementById("fnbSitesCountBadge");e&&(e.textContent=`${t.length} \u0111i\u1EC3m b\xE1n`),o&&(o.innerHTML=t.map(n=>{let s="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";return n.region==="Mi\u1EC1n B\u1EAFc"?s="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300":n.region==="Mi\u1EC1n Trung"&&(s="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300"),`
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-4 font-mono font-bold text-brand-500 dark:text-brand-400 text-xs">${n.code}</td>
          <td class="py-3 px-4 font-bold text-gray-900 dark:text-white">${n.name}</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded text-xs font-bold border ${s}">${n.region||"Mi\u1EC1n Nam"}</span>
          </td>
          <td class="py-3 px-4 text-gray-500 dark:text-gray-400">${n.address||"H\u1EC7 th\u1ED1ng c\u0103n tin T\xE2n Long Group"}</td>
          <td class="py-3 px-3">
            <div class="font-semibold text-gray-800 dark:text-gray-200">${n.site_type||"Qu\u1EA3n L\xFD C\u01A1 S\u1EDF"}</div>
            <div class="text-xs font-mono tabular-nums text-gray-400">${n.phone||"0903.xxx.xxx"}</div>
          </td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-gray-900 dark:text-white">${Number(n.budget||1e7).toLocaleString("vi-VN")} \u20AB</td>
          <td class="py-3 px-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">HO\u1EA0T \u0110\u1ED8NG</span>
          </td>
        </tr>
      `}).join("")),a&&(a.innerHTML=t.map(n=>{let s="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";return n.region==="Mi\u1EC1n B\u1EAFc"?s="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300":n.region==="Mi\u1EC1n Trung"&&(s="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300"),`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-xs text-brand-500 dark:text-brand-400">${n.code}</span>
              <span class="px-2 py-0.5 rounded text-xs font-bold border ${s}">${n.region||"Mi\u1EC1n Nam"}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">HO\u1EA0T \u0110\u1ED8NG</span>
          </div>
          <div class="font-bold text-xs text-gray-900 dark:text-white">${n.name}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5"></i>
            <span>${n.address||"H\u1EC7 th\u1ED1ng c\u0103n tin T\xE2n Long Group"}</span>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span class="text-gray-500">H\u1EA1n m\u1EE9c ng\xE2n s\xE1ch:</span>
            <span class="font-bold text-gray-900 dark:text-white font-mono tabular-nums">${Number(n.budget||1e7).toLocaleString("vi-VN")} \u20AB</span>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&typeof lucide.createIcons=="function"&&lucide.createIcons()}function sa(){if(!j||j.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u x\u1EBFp h\u1EA1ng \u0111\u1EC3 xu\u1EA5t Excel","warning");return}try{if(typeof XLSX>"u"){typeof showToast=="function"&&showToast("L\u1ED7i: Th\u01B0 vi\u1EC7n xu\u1EA5t Excel ch\u01B0a s\u1EB5n s\xE0ng","error");return}let t=XLSX.utils.book_new(),o=["H\u1EA1ng","M\xE3 SAP","\u0110i\u1EC3m B\xE1n & B\u1EBFp \u0102n","V\xF9ng Mi\u1EC1n","Doanh Thu Thu\u1EA7n (VN\u0110)","M\u1EE5c Ti\xEAu Th\xE1ng (VN\u0110)","% \u0110\u1EA1t Ch\u1EC9 Ti\xEAu","Food Cost %","Labor Cost %","L\u1EE3i Nhu\u1EADn EBITDA (VN\u0110)","Bi\xEAn LN %","Tr\u1EA1ng Th\xE1i"],a=j.map(c=>[c.rank,c.code,c.name,c.region,c.netRevenue,c.targetRevenue,parseFloat(String(c.achievementPct))/100,parseFloat(String(c.foodCostPct))/100,parseFloat(String(c.laborCostPct))/100,c.operatingProfit,parseFloat(String(c.profitMargin))/100,c.status]),e=XLSX.utils.aoa_to_sheet([o,...a]),n={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:"center"}},s={font:{name:"Aptos",sz:11}},r={font:{name:"Aptos",sz:11},alignment:{horizontal:"center"}},i={font:{name:"Aptos",sz:11},alignment:{horizontal:"right"}},l=XLSX.utils.decode_range(e["!ref"]||"A1");for(let c=l.s.r;c<=l.e.r;++c)for(let u=l.s.c;u<=l.e.c;++u){let m=XLSX.utils.encode_cell({r:c,c:u});e[m]&&(c===0?e[m].s=n:u===0||u===1||u===3||u===11?e[m].s=r:u===2?e[m].s=s:u===6||u===7||u===8||u===10?(e[m].s=i,e[m].z="0.0%"):(e[m].s=i,e[m].z="#,##0"))}e["!freeze"]={xSplit:0,ySplit:1},e["!autofilter"]={ref:e["!ref"]},e["!cols"]=[{wch:8},{wch:10},{wch:38},{wch:14},{wch:22},{wch:20},{wch:14},{wch:14},{wch:14},{wch:22},{wch:12},{wch:16}],XLSX.utils.book_append_sheet(t,e,"XepHangChuoi");let d=new Date().toISOString().slice(0,10);XLSX.writeFile(t,`Orbit_Siba_Food_XepHangChuoi_${d}.xlsx`),typeof showToast=="function"&&showToast("\u0110\xE3 xu\u1EA5t file Excel x\u1EBFp h\u1EA1ng to\xE0n chu\u1ED7i th\xE0nh c\xF4ng (chu\u1EA9n Aptos).","success")}catch(t){console.error("L\u1ED7i exportFnbChainExcel:",t),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+t.message,"error")}}function ia(){try{if(typeof XLSX>"u"){typeof showToast=="function"&&showToast("L\u1ED7i: Th\u01B0 vi\u1EC7n xu\u1EA5t Excel ch\u01B0a s\u1EB5n s\xE0ng","error");return}let t=bt||(typeof window<"u"?window.currentPLData:null)||{},o=t.netRevenue||47045e4,a=t.grossRevenue||485e6,e=t.discount||1455e4,n=t.channels||{dineIn:Math.round(o*.72),takeaway:Math.round(o*.2),catering:Math.round(o*.08)},s=t.foodCost||Math.round(o*.428),r=t.laborCost||Math.round(o*.185),i=t.primeCost||s+r,l=t.rentCost||28e6,d=t.utilityCost||Math.round(o*.034),c=t.supplyCost||Math.round(o*.03),u=t.wasteCost||Math.round(o*.012),m=t.marketingCost||Math.round(o*.015),f=t.totalCost||s+r+l+d+c+u+m,y=t.operatingProfit||o-f,p=_=>o>0?_/o:0,h=XLSX.utils.book_new(),g=[["KHO\u1EA2N M\u1EE4C B\xC1O C\xC1O P&L","S\u1ED0 TI\u1EC0N (VN\u0110)","% DOANH THU THU\u1EA6N","GHI CH\xDA / \u0110\u1ECANH M\u1EE8C"],["1. Doanh thu g\u1ED9p (Gross Sales)",a,p(a),"Tr\u01B0\u1EDBc khuy\u1EBFn m\xE3i"],["(-) Chi\u1EBFt kh\u1EA5u / Khuy\u1EBFn m\xE3i POS",-e,p(-e),"Trong m\u1EE9c cho ph\xE9p <4%"],["2. DOANH THU THU\u1EA6N (Net Sales)",o,1,"Doanh thu chu\u1EA9n 100%"],["\u2022 \u0102n t\u1EA1i ch\u1ED7 (Dine-in)",n.dineIn,p(n.dineIn),"K\xEAnh ch\u1EE7 l\u1EF1c"],["\u2022 Mang \u0111i (Takeaway)",n.takeaway,p(n.takeaway),"K\xEAnh ph\u1EE5 tr\u1EE3"],["\u2022 Su\u1EA5t \u0103n c\xF4ng nghi\u1EC7p / Hub",n.catering,p(n.catering),"H\u1EE3p \u0111\u1ED3ng ngo\xE0i"],["3. Chi ph\xED Nguy\xEAn V\u1EADt Li\u1EC7u (Food Cost)",s,p(s),`M\u1EE5c ti\xEAu <=43.0% (${t.foodCostPct||(p(s)*100).toFixed(1)}%)`],["4. Chi ph\xED Nh\xE2n c\xF4ng tr\u1EF1c ti\u1EBFp (Labor Cost)",r,p(r),"M\u1EE5c ti\xEAu <=19.0% (18.5%)"],["5. PRIME COST (Food + Labor)",i,p(i),"M\u1EE5c ti\xEAu <=62.0%"],["6. Chi ph\xED M\u1EB7t b\u1EB1ng & Kh\u1EA5u hao",l,p(l),"Chi ph\xED c\u1ED1 \u0111\u1ECBnh"],["7. \u0110i\u1EC7n, N\u01B0\u1EDBc & Gas v\u1EADn h\xE0nh",d,p(d),"\u0110\u1ECBnh m\u1EE9c <=3.5%"],["8. V\u1EADt t\u01B0 ti\xEAu hao & CCDC",c,p(c),"\u0110\u1ECBnh m\u1EE9c tr\u1EA7n theo h\u1EA1n m\u1EE9c"],["9. Hao h\u1EE5t & H\u1ECFng h\u1EE7y",u,p(u),"Ch\u1EC9 ti\xEAu <=1.0%"],["10. Ti\u1EBFp th\u1ECB & POS",m,p(m),"Ch\u1EC9 ti\xEAu <=1.5%"],["T\u1ED4NG CHI PH\xCD HO\u1EA0T \u0110\u1ED8NG",f,p(f),"T\u1ED5ng chi ph\xED v\u1EADn h\xE0nh"],["L\u1EE2I NHU\u1EACN HO\u1EA0T \u0110\u1ED8NG (EBITDA)",y,p(y),`${t.profitMargin||(p(y)*100).toFixed(1)}% Doanh thu`]],x=XLSX.utils.aoa_to_sheet(g),w={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:"center"}},v={font:{name:"Aptos",sz:11}},C={font:{name:"Aptos",sz:11},alignment:{horizontal:"right"}},E=XLSX.utils.decode_range(x["!ref"]||"A1");for(let _=E.s.r;_<=E.e.r;++_)for(let W=E.s.c;W<=E.e.c;++W){let F=XLSX.utils.encode_cell({r:_,c:W});x[F]&&(_===0?x[F].s=w:W===0?x[F].s=v:W===1?(x[F].s=C,x[F].z="#,##0"):W===2?(x[F].s=C,x[F].z="0.0%"):x[F].s=v)}x["!freeze"]={xSplit:0,ySplit:1},x["!autofilter"]={ref:x["!ref"]},x["!cols"]=[{wch:45},{wch:22},{wch:20},{wch:30}],XLSX.utils.book_append_sheet(h,x,"PL_DiemBan"),XLSX.writeFile(h,`Orbit_Siba_Food_PL_Report_${new Date().toISOString().slice(0,10)}.xlsx`),typeof showToast=="function"&&showToast("\u0110\xE3 xu\u1EA5t B\xE1o C\xE1o P&L \u0110i\u1EC3m B\xE1n th\xE0nh c\xF4ng (chu\u1EA9n Aptos).","success")}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t P&L Excel: "+t.message,"error")}}if(typeof window<"u"){let t=window;t.gChainRankings=j,t.gCurrentFilterRegion=Mt,t.currentPLData=bt,t.triggerSyncFnbMonthlySummary=Zo,t.loadFnbChain=Ge,t.renderFnbChainTable=$t,t.filterFnbChainByRegion=ta,t.onSearchChainSite=ea,t.viewSitePL=na,t.loadFnbPL=oe,t.filterPlBreakdown=Qe,t.renderFnbPL=ze,t.onSelectPLSite=oa,t.loadFnbPOS=aa,t.renderFnbPOS=Je,t.loadFnbSites=ra,t.renderFnbSites=_t,t.exportFnbChainExcel=sa,t.exportFnbPLExcel=ia}console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{Ut as STANDARD_STEPS,mo as addEditOrderItemLine,fn as addManualReceiptItem,At as addWasteLineRow,wa as api,kt as calcBudget,qt as canAuthenticateJourney,tt as canDeleteOrders,Z as canEditOrders,Co as changeStockPage,$o as clearStockSelection,ge as closeConfirmClearManualLinesModal,le as closeCreateReceiptModal,be as closeCreateWasteModal,Qt as closeDeleteOrderModal,Be as closeEditOrderModal,Un as closeInvDetailModal,ce as closeManualReceiptModal,Et as closeModal,lo as closeOrderJourneyModal,Ke as closeWhReceivedOrderDetailModal,Ue as confirmCancelReceivedOrder,pe as confirmClearAllManualReceiptLines,ho as confirmDeleteOrder,so as currentJourneyData,ro as currentJourneyOrderCode,bt as currentPLData,ya as debounce,Vo as downloadRopExcel,N as editOrderItems,b as escapeHtml,kn as executeClearAllManualReceiptLines,bo as executeDeleteOrder,Gn as exportCountSheetExcel,Oo as exportFefoToExcel,sa as exportFnbChainExcel,ia as exportFnbPLExcel,jt as exportFnbStockExcel,Po as exportSelectedStockExcel,Jo as exportWhInventoryToExcel,Yo as exportWhItemHistoryToExcel,st as filterFefoLive,ta as filterFnbChainByRegion,$e as filterHsOrders,Yn as filterItems,Oe as filterLeadTimeSla,lt as filterManualCatalogList,Qe as filterPlBreakdown,Ve as filterWhInventoryTable,Go as filterWhReceivedOrdersTable,Lt as formatBatchCode,re as formatCompactVND,G as formatDate,ba as formatDateYMD,Re as formatItemQty,L as formatNumber,at as formatReceiptDateYMD,St as formatUnit,S as formatVND,j as gChainRankings,Mt as gCurrentFilterRegion,K as gFnbStockData,H as gFnbStockFilter,Wt as gFnbStockSearchTerm,It as gWhActiveBatches,et as gWhActiveHistory,ot as gWhCurrentReceivedDetail,it as gWhFilteredInventory,P as gWhInventoryData,nt as gWhReceivedOrders,Q as getActiveFnbCountSite,V as getActiveFnbReceiptSite,q as getActiveFnbWasteSite,z as getAppItems,Ne as getDangerBadgeClass,wo as getDaysRemainingMobileText,xo as getDaysRemainingText,Fe as getDaysTextColor,yo as getExpBadgeClass,vo as getExpDateColor,A as getReceiptExpWarningHtml,ko as getSelectedStockSkus,Lo as getStockCurrentPage,pi as getWhActiveBatches,ui as getWhActiveHistory,ii as getWhFilteredInventory,si as getWhInventoryData,fi as getWhReceivedOrders,Ar as handleExportFnbStockExcel,qo as loadDashboardSummary,Ge as loadFnbChain,ca as loadFnbCounts,we as loadFnbCountsHistory,oe as loadFnbPL,aa as loadFnbPOS,rt as loadFnbPoList,tn as loadFnbReceipts,cn as loadFnbReceiptsHistory,ra as loadFnbSites,ve as loadFnbStock,la as loadFnbWaste,fe as loadFnbWasteHistory,oo as loadHistory,Wo as loadLeadTime,xt as loadManualCatalogItems,Te as loadQuota,jo as loadReorderROP,Zt as loadStockFEFO,Dt as loadWasteModalItems,qe as loadWhInventory,ne as loadWhReceivedOrders,Vn as onCountInputChange,qn as onCountNoteChange,Pn as onFnbCountDateChange,An as onFnbCountFilterChange,Dn as onFnbCountNganhHangChange,On as onFnbCountSearch,jn as onFnbCountSiteChange,en as onFnbPoSearchInput,Qn as onFnbStockFilterChange,zn as onFnbStockSearch,Jn as onFnbStockToggleValue,Tn as onFnbWasteFilterChange,Cn as onFnbWasteNganhHangChange,En as onFnbWasteSearch,In as onFnbWasteSiteChange,yn as onManualLineBatchChange,xn as onManualLineExpChange,vn as onManualLineLocChange,bn as onManualLinePriceChange,hn as onManualLineQtyChange,gn as onManualReceiptSiteChange,Zn as onQtyChange,on as onReceiptLineBatchChange,an as onReceiptLineExpChange,sn as onReceiptLineNoteChange,nn as onReceiptLineQtyChange,ea as onSearchChainSite,oa as onSelectPLSite,_n as onWasteLineNoteChange,Mn as onWasteLineQtyChange,$n as onWasteLineReasonChange,Fn as onWasteModalItemSelect,ye as onWasteModalLineQtyInput,Nn as onWasteModalSiteChange,zo as onWhRecModalCancelClick,dn as openCreateReceiptModal,Hn as openCreateWasteModal,Fo as openEditItemModal,uo as openEditOrderModal,Bo as openIssueModal,Do as openItemDetailModal,pn as openManualReceiptModal,io as openOrderJourneyModal,ie as openPoReceiptModal,_o as openReceiptModal,Ko as openWhItemBatchesModal,Xo as openWhItemHistoryModal,Qo as openWhReceivedOrderDetail,ht as parseQty,_e as pendingDeleteOrderCode,Ot as populateFnbCountFilters,Pt as populateFnbCountNhomHangDropdown,he as populateFnbWasteFilters,Ft as populateFnbWasteNhomHangDropdown,me as populateFnbWasteSiteDropdown,Xe as populateWhReceivedOrdersSiteFilter,He as recalcEditOrderTotals,xe as recalculateWasteModalTotal,go as removeEditOrderItemLine,ue as removeManualReceiptLine,ft as renderEditOrderItems,De as renderFefoRows,$t as renderFnbChainTable,X as renderFnbCountsTable,ze as renderFnbPL,Je as renderFnbPOS,Ht as renderFnbPoTable,_t as renderFnbSites,wt as renderFnbStock,gt as renderFnbWasteStockTable,Kt as renderHsOrdersList,Xt as renderJourneyBadge,Gt as renderJourneyTimeline,te as renderLeadTimeTable,ut as renderManualReceiptLinesTable,vt as renderOrderTable,de as renderReceiptLinesTable,Ae as renderRopTable,je as renderStockAlertsTable,ee as renderWhReceivedOrdersTable,Eo as resetFefoFilters,to as reviewOrder,fo as saveEditOrder,Xn as saveFnbCountAudit,Ro as saveItemSpecs,R as selectedStockSkus,Vt as setAppItems,wn as setManualLineQuickExp,rn as setReceiptLineQuickExp,So as setStockCurrentPage,To as sortStockBy,ln as submitCreateReceipt,Rn as submitCreateWaste,Bn as submitDirectWaste,No as submitIssueToBackend,co as submitJourneyStep,Ln as submitManualReceipt,eo as submitOrder,Ho as submitReceiptToBackend,ct as switchFnbReceiptSubView,pt as switchFnbWasteSubView,Uo as switchWhInvSubView,Wn as toggleBlindCount,mn as toggleManualShowAllCatalog,Io as toggleSelectAllStock,Mo as toggleStockItemSelect,Zo as triggerSyncFnbMonthlySummary,Pe as updateApexChartsTheme,po as updateEditOrderItemQty,Nt as updateManualTotals,Tt as updateStockBulkBar,We as updateTailadminDashboard,Rt as updateWasteKPIs,Kn as viewCountDetail,ao as viewOrderDetail,un as viewReceiptDetail,na as viewSitePL,Sn as viewWasteDetail};
