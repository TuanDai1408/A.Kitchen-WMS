function be(t){return t==null||isNaN(t)?"0 \u20AB":Math.round(t).toLocaleString("vi-VN")+" \u20AB"}function G(t){if(t==null||isNaN(t))return{val:"\u2014",unit:"",full:"\u2014"};let e=Number(t),n=Math.abs(e),o=e<0?"-":"",i=e.toLocaleString("vi-VN")+" \u20AB";if(n>=1e9){let s=(n/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:o+s,unit:"t\u1EF7 \u20AB",full:i}}else if(n>=1e6){let s=(n/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:o+s,unit:"tr \u20AB",full:i}}else return{val:o+n.toLocaleString("vi-VN"),unit:"\u20AB",full:i}}function he(t){if(!t)return"\u2014";if(typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t.trim()))return t.trim();try{let e=new Date(t);if(isNaN(e.getTime()))return String(t);let n=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0");return`${n}-${o}-${i}`}catch{return String(t)}}function ye(t,e=1){return t==null||isNaN(t)?"0":Number(t).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:e})}function l(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function fe(t,e=200){let n=null;return function(...o){n&&clearTimeout(n),n=setTimeout(()=>{t.apply(this,o)},e)}}var Y=class{cache=new Map;defaultTtl=3e4;async get(e,n=this.defaultTtl){let o=Date.now(),i=this.cache.get(e);if(i&&o-i.timestamp<n)return o-i.timestamp>1e4&&fetch(e).then(s=>s.json()).then(s=>{s.success&&this.cache.set(e,{timestamp:Date.now(),data:s})}).catch(()=>{}),i.data;try{let r=await(await fetch(e)).json();return r.success&&this.cache.set(e,{timestamp:o,data:r}),r}catch(s){return{success:!1,error:s instanceof Error?s.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(e,n){this.cache.clear();try{return await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json()}catch(o){return{success:!1,error:o instanceof Error?o.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(e){if(!e){this.cache.clear();return}for(let n of this.cache.keys())n.includes(e)&&this.cache.delete(n)}async getPoList(e,n="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(e)}&status=${encodeURIComponent(n)}`)}async getPoDetails(e){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(e)}`)}async getReceiptHistory(e){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(e)}`)}async getInventory(e){return this.get(`/api/wh/inventory?site=${encodeURIComponent(e)}`)}async submitManualReceipt(e){return this.post("/api/fnb/manual-receipt",e)}},we=new Y;function S(){let t=localStorage.getItem("orbit_user_site");if(t)return t.toUpperCase();let e=window,n=typeof e.App<"u"&&e.App.currentBranch?e.App.currentBranch.toUpperCase():"K001";return n==="ALL"||!n?"K001":n}function E(t){if(!t||t==="\u2014")return"\u2014";let e=String(t).trim(),n=e.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;try{let o=new Date(e);if(!isNaN(o.getTime())){let i=o.getFullYear(),s=String(o.getMonth()+1).padStart(2,"0"),r=String(o.getDate()).padStart(2,"0");return`${i}-${s}-${r}`}}catch{}return e.slice(0,10)}function M(t){if(!t)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let e=new Date;e.setHours(0,0,0,0);let n=new Date(t);n.setHours(0,0,0,0);let o=Math.ceil((n.getTime()-e.getTime())/(1e3*60*60*24));return o<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(o)} ng\xE0y)</span>`:o===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':o<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${o} ng\xE0y)</span>`:o<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${o} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${o} ng\xE0y</span>`}function R(t){window.gFnbReceiptCurrentView=t;let e=document.getElementById("fnbReceiptTabBtnPo"),n=document.getElementById("fnbReceiptTabBtnHistory"),o=document.getElementById("fnbPoListView"),i=document.getElementById("fnbReceiptHistoryView");t==="po"?(e&&(e.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),o&&o.classList.remove("hidden"),i&&i.classList.add("hidden"),$()):(n&&(n.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),e&&(e.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),i&&i.classList.remove("hidden"),o&&o.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function pt(t){let e=t||S(),n=document.getElementById("fnbReceiptFilterSite");n&&(n.value=e);let i=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(a=>a.code.toUpperCase()===e.toUpperCase()),s=i?i.ten||i.name:e,r=document.getElementById("fnbReceiptCurrentSiteBadge");r&&(r.textContent=s),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(e):await $(e)}function gt(t){A(t)}async function $(t){let e=t||S(),n=document.getElementById("fnbPoStatusFilter"),o=n?n.value:"OPEN",i=document.getElementById("fnbPoSummaryText");try{i&&(i.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${e}...`);let r=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(e)}&status=${encodeURIComponent(o)}&no-cache=1`)).json();if(r.success&&r.data){window.gFnbPoList=r.data;let a=document.getElementById("fnbPoSearchInput")?.value||"";A(a);let d=(window.gFnbPoList||[]).filter(m=>m.status==="OPEN").length,u=document.getElementById("fnbReceiptBadgePendingCount");u&&(u.textContent=String(d))}else throw new Error(r.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(s){console.error("loadFnbPoList error:",s),i&&(i.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+s.message)}}function A(t=""){let e=document.getElementById("fnbPoTableBody"),n=document.getElementById("fnbPoMobileCards"),o=document.getElementById("fnbPoSummaryText"),i=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),s=(t||"").toLowerCase().trim(),r=window.gFnbPoList||[];i&&(r=r.filter(a=>{let d=(a.supplier_name||"").toLowerCase();return i==="siba"?d.includes("siba")||d.includes("b\u1EBFp trung t\xE2m")||d.includes("trung t\xE2m"):i==="baf"?d.includes("baf")||d.includes("th\u1ECBt"):i==="spice"?d.includes("gia v\u1ECB")||d.includes("\u0111\u01B0\u1EDDng")||d.includes("unilever")||d.includes("cholimex")||d.includes("mu\u1ED1i"):i==="veg"?d.includes("rau")||d.includes("\u0111\xE0 l\u1EA1t")||d.includes("c\u1EE7"):!0})),s&&(r=r.filter(a=>{let d=(a.po_number||"").toLowerCase(),u=(a.supplier_name||"").toLowerCase(),m=(a.supplier_code||"").toLowerCase();return d.includes(s)||u.includes(s)||m.includes(s)})),o&&(o.textContent=`Hi\u1EC3n th\u1ECB ${r.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),e&&(r.length===0?e.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':e.innerHTML=r.map(a=>{let d=a.status==="OPEN",u=a.status==="COMPLETED",m=u?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',p=(a.po_number||"").startsWith("50000")||!a.supplier_code||a.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',b=Number(a.total_amount)||0,h=Number(a.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${l(a.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${l(E(a.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${p}
                <span class="font-medium text-gray-900 dark:text-white">${l(a.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${a.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${l(a.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${a.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${h.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${b>0?Math.round(b).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${m}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${l(a.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${u?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${u?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${u?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),n&&(r.length===0?n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':n.innerHTML=r.map(a=>{let d=a.status==="COMPLETED",u=(a.po_number||"").startsWith("50000")||!a.supplier_code||a.supplier_name==="B\u1EBFp Trung T\xE2m Siba",m=Number(a.total_amount)||0,y=Number(a.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${u?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${u?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${l(a.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${l(a.po_number)} \u2022 ${l(E(a.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${d?"text-emerald-600":"text-amber-600"} block">${d?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${a.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${y.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${m>0?Math.round(m).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${l(a.po_number)}')" class="w-full py-2 rounded-xl ${d?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${d?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${d?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function z(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+t+"...");let n=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}&no-cache=1`)).json();if(!n.success||!n.data)throw new Error(n.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let o=n.data;if(!o.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let i=o[0],s=document.getElementById("receiptModalInvoice"),r=document.getElementById("receiptModalInvoiceDisplay"),a=document.getElementById("receiptModalSite"),d=document.getElementById("receiptModalSiteDisplay"),u=document.getElementById("receiptModalSupplier"),m=document.getElementById("receiptModalSupplierDisplay"),y=document.getElementById("receiptModalDate"),p=new Date().toISOString().slice(0,10);s&&(s.value=i.po_number),r&&(r.textContent=i.po_number),a&&(a.value=i.site),d&&(d.textContent=i.site),u&&(u.value=i.supplier_name),m&&(m.textContent=i.supplier_name),y&&(y.value=p);let b="L\xD4-"+p.replace(/-/g,"").slice(2),h=new Date;h.setFullYear(h.getFullYear()+1);let c=h.toISOString().slice(0,10);window.gReceiptLines=o.map(w=>{let k=(w.merch_category||"").toLowerCase(),L=!k.includes("bao b\xEC")&&!k.includes("c\xF4ng c\u1EE5")&&!k.includes("h\xF3a ch\u1EA5t")&&!k.includes("t\u1EA1p ph\u1EA9m");return{po_item:w.po_item,item_code:w.item_code,item_name:w.item_name,merch_category:w.merch_category,unit:w.unit||"KG",unit_price:Number(w.unit_price)||0,order_qty:Number(w.order_qty)||0,actual_qty:Number(w.order_qty)||0,batch_code:b,exp_date:L?c:"",is_food:L,note:""}}),J();let f=document.getElementById("createReceiptModal");f&&f.classList.remove("hidden")}catch(e){console.error("openPoReceiptModal error:",e),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function J(){let t=document.getElementById("receiptLinesTableBody"),e=document.getElementById("receiptLinesMobileCards"),n=document.getElementById("receiptModalLineCount"),o=document.getElementById("receiptModalTotalAmount"),i=window.gReceiptLines||[];n&&(n.textContent=String(i.length));let s=0;t&&(t.innerHTML=i.map((r,a)=>{let d=(r.actual_qty||0)*(r.unit_price||0);return s+=d,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${a+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${l(r.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${l(r.item_code)}</span>
              ${r.merch_category?`<span>\u2022</span><span>${l(r.merch_category)}</span>`:""}
              ${r.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${l(r.unit||"")}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300">
            ${Number(r.unit_price).toLocaleString("vi-VN")} \u0111
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
            ${Number(r.order_qty).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" step="0.01" min="0" value="${r.actual_qty}" 
                   oninput="onReceiptLineQtyChange(${a}, this.value)" 
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="text" value="${l(r.batch_code||"")}" placeholder="L\xF4 SX..." 
                   oninput="onReceiptLineBatchChange(${a}, this.value)" 
                   class="w-28 text-center py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex flex-col items-center">
              <input type="date" id="receiptLineExpInput_${a}" value="${r.exp_date||""}" 
                     onchange="onReceiptLineExpChange(${a}, this.value)" 
                     class="w-32 py-1 px-1.5 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <div class="flex items-center gap-1 mt-1">
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 1)" title="+1 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 6)" title="+6 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 12)" title="+1 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 24)" title="+2 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+2N</button>
              </div>
              <div id="receiptExpWarning_${a}" class="mt-1">
                ${M(r.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${a}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${d>0?Math.round(d).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${l(r.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${a}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),e&&(e.innerHTML=i.map((r,a)=>{let d=(r.actual_qty||0)*(r.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${l(r.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${l(r.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${l(r.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(r.unit_price).toLocaleString("vi-VN")} \u0111</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">#${a+1}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl text-center tabular-nums text-xs">
            <div>
              <span class="text-gray-400 block text-[11px]">SL \u0110\u1EB7t SAP:</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">${Number(r.order_qty).toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Th\xE0nh ti\u1EC1n:</span>
              <span id="receiptLineTotalMob_${a}" class="num font-bold text-brand-600 dark:text-brand-400">${d>0?Math.round(d).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
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
                     oninput="onReceiptLineQtyChange(${a}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center">
            </div>

            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">S\u1ED1 l\xF4 (Batch):</label>
              <input type="text" value="${l(r.batch_code||"")}" placeholder="L\xF4 SX..." 
                     oninput="onReceiptLineBatchChange(${a}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">H\u1EA1n d\xF9ng (EXP):</label>
                <input type="date" id="receiptLineExpInputMob_${a}" value="${r.exp_date||""}" 
                       onchange="onReceiptLineExpChange(${a}, this.value)" 
                       class="flex-1 py-1 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 outline-none">
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <span class="text-[11px] text-gray-400">Ch\u1ECDn nhanh:</span>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 1)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 6)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 12)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${a}, 24)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+2N</button>
              </div>
              <div id="receiptExpWarningMob_${a}" class="mt-1">
                ${M(r.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${l(r.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${a}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),o&&(o.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function mt(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let n=parseFloat(e);window.gReceiptLines[t].actual_qty=isNaN(n)?0:n;let o=window.gReceiptLines[t],i=(o.actual_qty||0)*(o.unit_price||0),s=document.getElementById(`receiptLineTotal_${t}`);s&&(s.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let r=document.getElementById(`receiptLineTotalMob_${t}`);r&&(r.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let a=0;window.gReceiptLines.forEach(u=>{a+=(u.actual_qty||0)*(u.unit_price||0)});let d=document.getElementById("receiptModalTotalAmount");d&&(d.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function bt(t,e){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].batch_code=e)}function ht(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;window.gReceiptLines[t].exp_date=e;let n=document.getElementById(`receiptExpWarning_${t}`);n&&(n.innerHTML=M(e));let o=document.getElementById(`receiptExpWarningMob_${t}`);o&&(o.innerHTML=M(e)),window.lucide&&window.lucide.createIcons()}function yt(t,e){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let n=new Date;n.setMonth(n.getMonth()+e);let o=n.toISOString().slice(0,10);window.gReceiptLines[t].exp_date=o;let i=document.getElementById(`receiptLineExpInput_${t}`);i&&(i.value=o);let s=document.getElementById(`receiptLineExpInputMob_${t}`);s&&(s.value=o);let r=document.getElementById(`receiptExpWarning_${t}`);r&&(r.innerHTML=M(o));let a=document.getElementById(`receiptExpWarningMob_${t}`);a&&(a.innerHTML=M(o)),window.lucide&&window.lucide.createIcons()}function ft(t,e){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].note=e)}function Z(){let t=document.getElementById("createReceiptModal");t&&t.classList.add("hidden")}function xt(){window.gFnbPoList&&window.gFnbPoList.length?z(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function wt(){let e=(window.gReceiptLines||[]).filter(p=>(p.actual_qty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let n=new Date;n.setHours(0,0,0,0);let o=!1;for(let p of e)if(p.exp_date){let b=new Date(p.exp_date);if(b.setHours(0,0,0,0),b<=n){o=!0;break}}if(o&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let i=document.getElementById("receiptModalSite")?.value||S(),s=document.getElementById("receiptModalInvoice")?.value||"",r=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),a=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",d=document.getElementById("receiptModalNotes")?.value||"",u=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",m={site_code:i,receipt_date:r,supplier:a,invoice_no:s,notes:d,created_by:u,lines:e.map(p=>({item_code:p.item_code,qty:p.actual_qty,unit_price:p.unit_price,batch_code:(p.batch_code||"").trim(),exp_date:(p.exp_date||"").trim()||null,note:p.note||""}))},y=document.getElementById("btnSubmitReceipt");y&&(y.disabled=!0,y.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let b=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)})).json();if(!b.success)throw new Error(b.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${b.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${i} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Z(),await $(i),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(i),R("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(p){console.error("submitCreateReceipt error:",p),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+p.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),y&&(y.disabled=!1,y.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function vt(t){let e=t||S(),n=document.getElementById("fnbReceiptsTableBody"),o=document.getElementById("fnbReceiptsMobileCards");try{let s=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(e)}&no-cache=1`)).json();if(s.success&&s.data){let r=s.data.receipts||[],a=document.getElementById("fnbReceiptBadgeHistoryCount");a&&(a.textContent=String(r.length)),n&&(r.length?n.innerHTML=r.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${l(d.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${l(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${l(E(d.receipt_date))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${l(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</td>
              <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${l(d.invoice_no||"\u2014")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-3 px-3 text-gray-500 text-xs">${l(d.created_by||"Th\u1EE7 kho")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewReceiptDetail(${d.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):n.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${l(e)}.</td></tr>`),o&&(r.length?o.innerHTML=r.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${l(d.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${l(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${l(E(d.receipt_date))} \u2022 PO: ${l(d.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${l(d.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(i){console.error("loadFnbReceiptsHistory error:",i)}}async function Lt(t){try{typeof window.showLoading=="function"&&window.showLoading();let n=await(await fetch(`/api/fnb/receipts?id=${t}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let o=n.data.lines||[],i=document.getElementById("invDetailModal"),s=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");s&&(s.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${t}`),r&&(r.textContent=`${o.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let a=`
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
            ${o.map(u=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${l(u.item_name||u.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${l(u.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(u.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${l(u.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${u.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${l(u.exp_date?String(u.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(u.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(u.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${l(u.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=a),i&&i.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function kt(t){let e=t||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||S()||"K001",o=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(f=>f.code.toUpperCase()===e.toUpperCase()),i=o?o.ten||o.name:e,s=i.startsWith(e)?i:`${e} - ${i}`,r=document.getElementById("manualReceiptSiteNameDisplay");r&&(r.textContent=s);let a=document.getElementById("manualReceiptSiteSelect");a&&(a.value=e);let d=document.getElementById("manualReceiptSiteBadge");d&&(d.textContent=e);let u=document.getElementById("manualReceiptDate");u&&(u.value=new Date().toISOString().slice(0,10));let m=document.getElementById("manualReceiptSupplier");m&&!m.value&&(m.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let y=document.getElementById("manualReceiptInvoiceNo");y&&(y.value="");let p=document.getElementById("manualReceiptNotes");p&&(p.value="");let b=document.getElementById("manualItemSearchInput");b&&(b.value="");let h=document.getElementById("manualItemCategorySelect");h&&(h.value=""),window.gManualReceiptLines=[],H();let c=document.getElementById("modalManualReceipt");c&&c.classList.remove("hidden"),await P(e,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function tt(){let t=document.getElementById("modalManualReceipt");t&&t.classList.add("hidden")}async function Ct(t){let e=document.getElementById("manualReceiptSiteBadge");e&&(e.textContent=t),await P(t,window.gManualShowAllCatalog)}async function Mt(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let t=document.getElementById("txtToggleManualCatalog");t&&(t.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let e=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await P(e,window.gManualShowAllCatalog)}async function P(t,e){let n=document.getElementById("manualCatalogListContainer");n&&(n.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let o=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}${e?"&include_all=1":""}`,s=await(await fetch(o)).json();s.success&&s.data?window.gManualSiteCatalog=s.data.items||[]:window.gManualSiteCatalog=[],N()}catch(o){console.error("loadManualCatalogItems error:",o),n&&(n.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${l(o.message)}</div>`)}}function N(){let t=document.getElementById("manualCatalogListContainer"),e=document.getElementById("manualCatalogCountText"),n=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),o=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),i=window.gManualSiteCatalog||[];if(n&&(i=i.filter(s=>{let r=(s.code||s.sku||"").toLowerCase(),a=(s.name||"").toLowerCase();return r.includes(n)||a.includes(n)})),o&&(i=i.filter(s=>(s.nhom_hang||s.item_group||s.nganh_hang||"").toLowerCase().includes(o))),e&&(e.textContent=String(i.length)),!!t){if(!i.length){t.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${n?`v\u1EDBi t\u1EEB kh\xF3a "${l(n)}"`:""}.
      </div>
    `;return}t.innerHTML=i.map(s=>{let r=s.code||s.sku,a=(window.gManualReceiptLines||[]).find(m=>m.item_code===r),d=parseFloat(s.book_qty||0),u=parseFloat(s.unit_price||0);return`
      <div onclick="addManualReceiptItem('${r}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${a?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${l(s.name||r)}">
              ${l(s.name||r)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${l(s.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${l(r)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${d>0?"text-emerald-600":"text-gray-500"} font-mono">${d.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${u>0?Math.round(u).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
          </div>
        </div>
        <div>
          ${a?`
            <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs font-mono">
              <i data-lucide="check" class="w-3 h-3"></i> x${a.qty}
            </span>
          `:`
            <button type="button" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors">
              <i data-lucide="plus" class="w-3 h-3"></i> Th\xEAm
            </button>
          `}
        </div>
      </div>
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function St(t){let e=(window.gManualSiteCatalog||[]).find(o=>(o.code||o.sku)===t);if(!e)return;let n=(window.gManualReceiptLines||[]).find(o=>o.item_code===t);if(n)n.qty=Math.round((n.qty+1)*100)/100;else{let i="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),s=new Date;s.setFullYear(s.getFullYear()+1);let r=s.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:e.code||e.sku,item_name:e.name||e.code,unit:e.unit||"Ph\u1EA7n",unit_price:parseFloat(e.unit_price||0),qty:1,batch_code:i,exp_date:r,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}H(),N()}function H(){let t=document.getElementById("manualLinesEmptyState"),e=document.getElementById("manualLinesTableWrapper"),n=document.getElementById("manualLinesMobileCards"),o=document.getElementById("btnClearAllManualLines"),i=document.getElementById("manualLinesTableBody"),s=document.getElementById("manualSelectedCountText"),r=document.getElementById("manualSummaryTotalSkus"),a=document.getElementById("manualSummaryTotalQty"),d=document.getElementById("manualSummaryTotalAmount"),u=window.gManualReceiptLines||[];if(s&&(s.textContent=String(u.length)),r&&(r.textContent=u.length+" m\xE3"),!u.length){t&&t.classList.remove("hidden"),e&&(e.classList.add("hidden"),e.classList.remove("lg:block")),n&&(n.classList.add("hidden"),n.classList.remove("block")),o&&(o.classList.add("hidden"),o.classList.remove("flex")),a&&(a.textContent="0"),d&&(d.textContent="0 \u0111");return}t&&t.classList.add("hidden"),e&&(e.classList.remove("hidden"),e.classList.add("lg:block")),n&&(n.classList.remove("hidden"),n.classList.add("block")),o&&(o.classList.remove("hidden"),o.classList.add("flex"));let m=0,y=0;i&&(i.innerHTML=u.map((p,b)=>{let h=(p.qty||0)*(p.unit_price||0);return m+=p.qty||0,y+=h,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${b+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${l(p.item_name)}">
              ${l(p.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${l(p.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${l(p.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${p.qty}" 
                   oninput="onManualLineQtyChange(${b}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${p.unit_price}" 
                   oninput="onManualLinePriceChange(${b}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${b}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${h>0?Math.round(h).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${l(p.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${b}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${p.exp_date||""}" 
                   onchange="onManualLineExpChange(${b}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${l(p.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${b}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${b})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=u.map((p,b)=>{let h=(p.qty||0)*(p.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${b+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${l(p.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${l(p.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${b})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${l(p.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${p.qty}" 
                     oninput="onManualLineQtyChange(${b}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${p.unit_price}" 
                     oninput="onManualLinePriceChange(${b}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${h>0?Math.round(h).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${l(p.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${b}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${p.exp_date||""}" 
                   onchange="onManualLineExpChange(${b}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),a&&(a.textContent=m>0?Number.isInteger(m)?String(m):m.toFixed(1):"0"),d&&(d.textContent=y>0?Math.round(y).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function _t(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=parseFloat(e);window.gManualReceiptLines[t].qty=isNaN(n)?0:n,q()}function Tt(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=parseFloat(e);window.gManualReceiptLines[t].unit_price=isNaN(n)?0:n,q()}function q(){let t=0,e=0;(window.gManualReceiptLines||[]).forEach((i,s)=>{let r=(i.qty||0)*(i.unit_price||0);t+=i.qty||0,e+=r;let a=document.getElementById(`manualLineTotal_${s}`);a&&(a.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let n=document.getElementById("manualSummaryTotalQty"),o=document.getElementById("manualSummaryTotalAmount");n&&(n.textContent=t.toFixed(1)),o&&(o.textContent=Math.round(e).toLocaleString("vi-VN")+" \u0111")}function It(t,e){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].batch_code=e)}function Et(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;window.gManualReceiptLines[t].exp_date=e;let n=document.getElementById(`manualLineExpWarning_${t}`);n&&(n.innerHTML=M(e),window.lucide&&window.lucide.createIcons())}function $t(t,e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=new Date;n.setMonth(n.getMonth()+e);let o=n.toISOString().slice(0,10);window.gManualReceiptLines[t].exp_date=o;let i=document.getElementById(`manualLineExpInput_${t}`);i&&(i.value=o);let s=document.getElementById(`manualLineExpWarning_${t}`);s&&(s.innerHTML=M(o),window.lucide&&window.lucide.createIcons())}function Ft(t,e){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].storage_loc=e)}function et(t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let e=window.gManualReceiptLines[t];window.gManualReceiptLines.splice(t,1),H(),typeof N=="function"&&N(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(e.item_name||e.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function nt(){let t=window.gManualReceiptLines||[];if(!t.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let e=document.getElementById("confirmClearManualCountText");e&&(e.textContent=String(t.length));let n=document.getElementById("modalConfirmClearManualLines");n&&(n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function ot(){let t=document.getElementById("modalConfirmClearManualLines");t&&t.classList.add("hidden")}function Bt(){let t=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],ot(),H(),N(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${t} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function Nt(){let e=(window.gManualReceiptLines||[]).filter(h=>(h.qty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let n=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!n){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let o=new Date;o.setHours(0,0,0,0);let i=!1;for(let h of e)if(h.exp_date){let c=new Date(h.exp_date);if(c.setHours(0,0,0,0),c<=o){i=!0;break}}if(i&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let s=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",r=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),a=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",d=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",u=(document.getElementById("manualReceiptNotes")?.value||"").trim(),m=`[${a}] ${u}`.trim(),y=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",p={site_code:s,receipt_date:r,supplier:n,invoice_no:d,notes:m,created_by:y,lines:e.map(h=>({item_code:h.item_code,qty:h.qty,unit_price:h.unit_price,batch_code:(h.batch_code||"").trim(),exp_date:(h.exp_date||"").trim()||null,storage_loc:h.storage_loc||"K\u1EC7 B\u1EBFp",note:h.note||""}))},b=document.getElementById("btnSubmitManualReceipt");b&&(b.disabled=!0,b.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let c=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)})).json();if(!c.success)throw new Error(c.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${c.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${s} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),tt(),await $(s),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(s),R("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(h){console.error("submitManualReceipt error:",h),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+h.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),b&&(b.disabled=!1,b.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var g=window;g.gFnbReceiptCurrentView=g.gFnbReceiptCurrentView||"po";g.gFnbPoList=g.gFnbPoList||[];g.gReceiptLines=g.gReceiptLines||[];g.gManualReceiptLines=g.gManualReceiptLines||[];g.gManualSiteCatalog=g.gManualSiteCatalog||[];g.gManualShowAllCatalog=g.gManualShowAllCatalog||!1;g.getActiveFnbReceiptSite=S;g.formatReceiptDateYMD=E;g.getReceiptExpWarningHtml=M;g.switchFnbReceiptSubView=R;g.loadFnbReceipts=pt;g.onFnbPoSearchInput=gt;g.loadFnbPoList=$;g.renderFnbPoTable=A;g.openPoReceiptModal=z;g.renderReceiptLinesTable=J;g.onReceiptLineQtyChange=mt;g.onReceiptLineBatchChange=bt;g.onReceiptLineExpChange=ht;g.setReceiptLineQuickExp=yt;g.onReceiptLineNoteChange=ft;g.closeCreateReceiptModal=Z;g.openCreateReceiptModal=xt;g.submitCreateReceipt=wt;g.loadFnbReceiptsHistory=vt;g.viewReceiptDetail=Lt;g.openManualReceiptModal=kt;g.closeManualReceiptModal=tt;g.onManualReceiptSiteChange=Ct;g.toggleManualShowAllCatalog=Mt;g.loadManualCatalogItems=P;g.filterManualCatalogList=N;g.addManualReceiptItem=St;g.renderManualReceiptLinesTable=H;g.onManualLineQtyChange=_t;g.onManualLinePriceChange=Tt;g.updateManualTotals=q;g.onManualLineBatchChange=It;g.onManualLineExpChange=Et;g.setManualLineQuickExp=$t;g.onManualLineLocChange=Ft;g.removeManualReceiptLine=et;g.removeManualLine=et;g.confirmClearAllManualReceiptLines=nt;g.clearAllManualReceiptLines=nt;g.closeConfirmClearManualLinesModal=ot;g.executeClearAllManualReceiptLines=Bt;g.submitManualReceipt=Nt;function _(){let t=document.getElementById("globalBranchSelect")?.value,e=localStorage.getItem("orbit_user_site"),n=window,o=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():null,i=document.getElementById("fnbWasteFilterSite")?.value,s=t||e||o||i||"K001";return(s==="ALL"||s==="all")&&(s="K001"),s.toUpperCase()}function at(){let t=document.getElementById("fnbWasteFilterSite");if(!t)return;let e=t.value||_(),n=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(o=>o.code!=="ALL");if(n&&n.length){let o="";n.forEach(i=>{o+=`<option value="${i.code}" ${i.code.toUpperCase()===e.toUpperCase()?"selected":""}>${i.name}</option>`}),t.innerHTML=o,e&&Array.from(t.options).some(i=>i.value===e)&&(t.value=e)}}function W(t){let e=document.getElementById("subtab-fnb-waste-stock"),n=document.getElementById("subtab-fnb-waste-history"),o=document.getElementById("fnbWasteSubViewStock"),i=document.getElementById("fnbWasteSubViewHistory");t==="history"?(e&&(e.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),o&&o.classList.add("hidden"),i&&i.classList.remove("hidden")):(e&&(e.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),o&&o.classList.remove("hidden"),i&&i.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function it(t){let e=t||_(),n=document.getElementById("fnbWasteTableBody"),o=document.getElementById("fnbWasteMobileCards"),i=document.getElementById("fnbWasteBadgeHistoryCount");try{let r=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(e)}&no-cache=1`)).json();if(r.success&&r.data){let a=r.data.wastes||[];i&&(i.textContent=String(a.length)),n&&(a.length?n.innerHTML=a.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${l(d.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${l(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${l(String(d.waste_date||"").slice(0,10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${l(d.reason||"H\xE0ng h\u1ECFng")}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${l(d.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u20AB</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${l(d.notes||"\u2014")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${d.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi ti\u1EBFt">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):n.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${l(e)}.</td></tr>`),o&&(a.length?o.innerHTML=a.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${l(d.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${l(d.reason||"H\xE0ng h\u1ECFng")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y: ${l(String(d.waste_date||"").slice(0,10))} \u2022 \u0110i\u1EC3m: ${l(d.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u20AB</span>
                  <span class="text-xs text-gray-400">${l(d.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</span>
                </div>
              </div>
            </div>
          `).join(""):o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(s){console.error("loadFnbWasteHistory error:",s)}}async function Rt(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let n=await(await fetch(`/api/fnb/wastes?id=${t}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let o=n.data.lines||[],i=document.getElementById("invDetailModal"),s=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");s&&(s.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${t}`),r&&(r.textContent=`${o.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let a=`
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
            ${o.map(u=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${l(u.item_name||u.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${l(u.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${l(u.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(u.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(u.unit_price).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(u.amount).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${l(u.reason_detail||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=a),i&&i.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function st(){let t=document.getElementById("fnbWasteNganhHangFilter"),e=document.getElementById("fnbWasteNhomHangFilter");if(!t||!e)return;let n=new Map;(window.gFnbWasteStockItems||[]).forEach(i=>{let s=(i.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),r=(i.nhom_hang||i.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();n.has(s)||n.set(s,new Set),n.get(s).add(r)}),window.gFnbWasteNganhMap=n;let o='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(n.keys()).sort().forEach(i=>{o+=`<option value="${l(i)}">${l(i)}</option>`}),t.innerHTML=o,t.value="",V("")}function V(t){let e=document.getElementById("fnbWasteNhomHangFilter");if(!e)return;let n=new Set;window.gFnbWasteNganhMap&&(t&&window.gFnbWasteNganhMap.has(t)?window.gFnbWasteNganhMap.get(t).forEach(i=>n.add(i)):window.gFnbWasteNganhMap.forEach(i=>i.forEach(s=>n.add(s))));let o='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(n).sort().forEach(i=>{o+=`<option value="${l(i)}">${l(i)}</option>`}),e.innerHTML=o,e.value=""}function Ht(){let t=document.getElementById("fnbWasteNganhHangFilter")?.value||"";V(t),D()}function Wt(){D()}function Dt(t){D()}function Pt(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function D(){let t=document.getElementById("fnbWasteStockTableBody"),e=document.getElementById("fnbWasteStockMobileCards"),n=document.getElementById("fnbWasteStockEmptyState"),o=document.getElementById("fnbWasteSummary"),i=document.getElementById("fnbWasteBadgeInStockCount"),s=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),r=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),a=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),d=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),u=window.gFnbWasteStockItems||[],m=document.getElementById("kpiWasteInStockCount"),y=document.getElementById("kpiWasteInStockVal");m&&(m.textContent=String(u.length));let p=0;if(u.forEach(c=>{p+=Number(c.total_value)||Number(c.book_qty)*Number(c.unit_price)||0}),y){let c=G(p);y.innerHTML=`${c.val}<span class="kpi-unit">${c.unit}</span>`}i&&(i.textContent=String(u.length));let b=u.filter(c=>{if(a==="EXP"&&(c.days_remaining!==void 0?Number(c.days_remaining):999)>15&&!c.is_expired||s&&(c.nganh_hang||"").trim().toLowerCase()!==s||r&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==r)return!1;if(d){let f=(c.name||"").toLowerCase(),w=(c.code||"").toLowerCase();if(!f.includes(d)&&!w.includes(d))return!1}return!0});if(o&&(o.textContent=`Hi\u1EC3n th\u1ECB ${b.length} / ${u.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),j(),!b.length){t&&(t.innerHTML=""),e&&(e.innerHTML=""),n&&n.classList.remove("hidden");return}n&&n.classList.add("hidden");let h=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];t&&(t.innerHTML=b.map((c,f)=>{let w=Number(c.book_qty)||0,k=Number(c.unit_price)||0,L=Number(c.total_value)||w*k,C=c.wasteQty||0,F=C*k;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${f+1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${l(c.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${l(c.name||c.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${l(c.nganh_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
              ${c.nhom_hang&&c.nhom_hang!==c.nganh_hang?`<span>\u2022</span><span>${l(c.nhom_hang)}</span>`:""}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${l(c.unit||"Ph\u1EA7n")}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(k).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${w.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(L).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${w}" value="${C>0?C:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${l(c.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${l(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${h.map(B=>`<option value="${l(B)}" ${c.wasteReason===B?"selected":""}>${l(B)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${l(c.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${F>0?Math.round(F).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${l(c.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${l(c.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),e&&(e.innerHTML=b.map(c=>{let f=Number(c.book_qty)||0,w=Number(c.unit_price)||0,k=c.wasteQty||0,L=k*w;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${l(c.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${l(c.name||c.code)}</h4>
              <div class="text-xs text-gray-400">${l(c.nganh_hang||c.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${f.toFixed(1)} ${l(c.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(w).toLocaleString("vi-VN")} \u20AB / ${l(c.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${f.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${f}" value="${k>0?k:""}" placeholder="0"
                     oninput="onWasteLineQtyChange('${l(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Th\xE0nh Ti\u1EC1n H\u1EE7y</label>
              <div id="mobWasteLineTotal_${l(c.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${L>0?Math.round(L).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">L\xFD Do H\u1EE7y</label>
            <select onchange="onWasteLineReasonChange('${l(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${h.map(C=>`<option value="${l(C)}" ${c.wasteReason===C?"selected":""}>${l(C)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function At(t,e){let n=(window.gFnbWasteStockItems||[]).find(d=>d.code===t);if(!n)return;let o=parseFloat(e),i=Number(n.book_qty)||0;isNaN(o)||o<0?n.wasteQty=0:o>i?(n.wasteQty=i,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${i})`)):n.wasteQty=o;let s=n.wasteQty*(Number(n.unit_price)||0),r=document.getElementById(`wasteLineTotal_${t}`);r&&(r.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let a=document.getElementById(`mobWasteLineTotal_${t}`);a&&(a.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),j()}function qt(t,e){let n=(window.gFnbWasteStockItems||[]).find(o=>o.code===t);n&&(n.wasteReason=e)}function Vt(t,e){let n=(window.gFnbWasteStockItems||[]).find(o=>o.code===t);n&&(n.wasteNote=e)}function j(){let t=window.gFnbWasteStockItems||[],e=0,n=0;t.forEach(a=>{a.wasteQty>0&&(e++,n+=a.wasteQty*(Number(a.unit_price)||0))});let o=document.getElementById("kpiWasteSelectedCount");o&&(o.textContent=String(e));let i=document.getElementById("kpiWasteTotalEstAmount");if(i)if(n>0){let a=G(n);i.innerHTML=`${a.val}<span class="kpi-unit">${a.unit}</span>`}else i.textContent="0 \u20AB";let s=document.getElementById("btnSubmitDirectWaste"),r=document.getElementById("btnSubmitDirectWasteText");s&&(s.disabled=e===0),r&&(r.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${e})`)}async function jt(){let e=(window.gFnbWasteStockItems||[]).filter(d=>(d.wasteQty||0)>0);if(!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let n=_(),o=new Date().toISOString().slice(0,10),i=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",s=0;e.forEach(d=>{s+=d.wasteQty*(Number(d.unit_price)||0)});let r={site_code:n,waste_date:o,reason:e.length===1?e[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:i,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${e.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:i,lines:e.map(d=>({item_code:d.code,qty:d.wasteQty,unit_price:Number(d.unit_price)||0,reason_detail:d.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:d.wasteNote||""}))},a=document.getElementById("btnSubmitDirectWaste");a&&(a.disabled=!0,a.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let u=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(!u.success)throw new Error(u.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${u.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${n} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),W("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(d){console.error("submitDirectWaste error:",d),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+d.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),a&&(a.disabled=!1,a.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function Ot(){let t=document.getElementById("createWasteModal"),e=_(),n=document.getElementById("wasteModalSite"),o=document.getElementById("wasteModalDate");if(o&&!o.value&&(o.value=new Date().toISOString().slice(0,10)),n){let s="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(r=>{s+=`<option value="${r.code}" ${r.code===e?"selected":""}>${r.ten||r.name}</option>`}),n.innerHTML=s,n.value=e}await O(e);let i=document.getElementById("wasteLinesContainer");i&&(i.innerHTML=""),Q(),t&&t.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function rt(){let t=document.getElementById("createWasteModal");t&&t.classList.add("hidden")}async function Qt(){let t=document.getElementById("wasteModalSite")?.value||"K001";await O(t);let e=document.getElementById("wasteLinesContainer");e&&(e.innerHTML=""),Q()}async function O(t){try{let n=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=n.success&&n.data?n.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function Q(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=window.gWasteModalInStockItems||[],n="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),o='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';e.forEach(s=>{o+=`<option value="${l(s.code)}" data-price="${s.unit_price}" data-unit="${l(s.unit||"")}" data-stock="${s.book_qty}">[${l(s.code)}] ${l(s.name)} (T\u1ED3n: ${Number(s.book_qty).toFixed(1)} ${l(s.unit||"")})</option>`});let i=`
    <div id="${n}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${n}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${o}
        </select>
        <button type="button" onclick="document.getElementById('${n}')?.remove(); recalculateWasteModalTotal();" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">SL H\u1EE7y</label>
          <input type="number" step="0.01" min="0" placeholder="0" oninput="onWasteModalLineQtyInput('${n}', this.value)" class="waste-modal-qty w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold tabular-nums text-center outline-none focus:border-rose-500 font-mono">
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
  `;t.insertAdjacentHTML("beforeend",i),window.lucide&&window.lucide.createIcons()}function Ut(t,e){let n=document.getElementById(t);if(!n)return;let o=e.options[e.selectedIndex],i=Number(o?.getAttribute("data-price"))||0,s=Number(o?.getAttribute("data-stock"))||0,r=n.querySelector(".waste-modal-price");r&&(r.textContent=Math.round(i).toLocaleString("vi-VN")+" \u20AB");let a=n.querySelector(".waste-modal-qty");a&&(a.max=String(s),a.placeholder=`T\u1ED1i \u0111a ${s.toFixed(1)}`),dt(t,a?a.value:"0")}function dt(t,e){let n=document.getElementById(t);if(!n)return;let o=n.querySelector("select"),i=o?.options[o.selectedIndex],s=Number(i?.getAttribute("data-price"))||0,a=(parseFloat(e)||0)*s,d=n.querySelector(".waste-modal-amt");d&&(d.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),lt()}function lt(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=0;t.querySelectorAll(".p-3").forEach(o=>{let i=o.querySelector("select"),s=i?.options[i.selectedIndex],r=Number(s?.getAttribute("data-price"))||0,a=o.querySelector(".waste-modal-qty"),d=parseFloat(a?.value||"0")||0;e+=d*r});let n=document.getElementById("wasteModalTotalAmount");n&&(n.textContent=e>0?Math.round(e).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function Kt(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let e=[];if(t.querySelectorAll(".p-3").forEach(m=>{let y=m.querySelector("select"),p=y?.value,b=y?.options[y.selectedIndex],h=Number(b?.getAttribute("data-price"))||0,c=m.querySelector(".waste-modal-qty"),f=parseFloat(c?.value||"0")||0;p&&f>0&&e.push({item_code:p,qty:f,unit_price:h,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!e.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let n=document.getElementById("wasteModalSite")?.value||_(),o=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),i=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",s=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",r=document.getElementById("wasteModalNotes")?.value||"",a=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",d={site_code:n,waste_date:o,reason:i,confirmed_by:s,notes:r,created_by:a,lines:e},u=document.getElementById("btnSubmitWaste");u&&(u.disabled=!0,u.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let y=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)})).json();if(!y.success)throw new Error(y.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${y.data.waste_code}!`),rt(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),W("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(m){console.error("submitCreateWaste error:",m),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+m.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),u&&(u.disabled=!1,u.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function re(){at();let t=_(),e=document.getElementById("fnbWasteFilterSite");e&&e.value!==t&&(e.value=t);let n=document.getElementById("fnbWasteSummary");n&&(n.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+t+"...");try{let i=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();i.success&&i.data?window.gFnbWasteStockItems=(i.data.items||[]).map(s=>({...s,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],st(),D(),it(t)}catch(o){console.error("loadFnbWaste error:",o),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+o.message)}}var x=window;x.gFnbWasteStockItems=x.gFnbWasteStockItems||[];x.gFnbWasteNganhMap=x.gFnbWasteNganhMap||null;x.gWasteModalInStockItems=x.gWasteModalInStockItems||[];x.getActiveFnbWasteSite=_;x.populateFnbWasteSiteDropdown=at;x.loadFnbWaste=re;x.switchFnbWasteSubView=W;x.populateFnbWasteFilters=st;x.populateFnbWasteNhomHangDropdown=V;x.onFnbWasteNganhHangChange=Ht;x.onFnbWasteFilterChange=Wt;x.onFnbWasteSearch=Dt;x.onFnbWasteSiteChange=Pt;x.renderFnbWasteStockTable=D;x.onWasteLineQtyChange=At;x.onWasteLineReasonChange=qt;x.onWasteLineNoteChange=Vt;x.updateWasteKPIs=j;x.submitDirectWaste=jt;x.loadFnbWasteHistory=it;x.viewWasteDetail=Rt;x.openCreateWasteModal=Ot;x.closeCreateWasteModal=rt;x.onWasteModalSiteChange=Qt;x.loadWasteModalItems=O;x.addWasteLineRow=Q;x.onWasteModalItemSelect=Ut;x.onWasteModalLineQtyInput=dt;x.recalculateWasteModalTotal=lt;x.submitCreateWaste=Kt;function I(){let t=localStorage.getItem("orbit_user_site"),e=document.getElementById("globalBranchSelect")?.value,n=window,o=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():null,i=document.getElementById("fnbCountSiteSelect")?.value,s=t||e||o||i||"K001";return(s==="ALL"||s==="all")&&(s="K001"),s.toUpperCase()}function U(){let t=document.getElementById("fnbCountNganhHangFilter"),e=document.getElementById("fnbCountNhomHangFilter");if(!t||!e)return;let n=new Map;(window.gFnbAllItems||[]).forEach(s=>{let r=(s.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),a=(s.nhom_hang||s.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();n.has(r)||n.set(r,new Set),n.get(r).add(a)}),window.gFnbNganhMap=n;let i='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(n.keys()).sort().forEach(s=>{i+=`<option value="${l(s)}">${l(s)}</option>`}),t.innerHTML=i,t.value="",K("")}function K(t){let e=document.getElementById("fnbCountNhomHangFilter");if(!e)return;let n=new Set;window.gFnbNganhMap&&(t&&window.gFnbNganhMap.has(t)?window.gFnbNganhMap.get(t).forEach(i=>n.add(i)):window.gFnbNganhMap.forEach(i=>i.forEach(s=>n.add(s))));let o='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(n).sort().forEach(i=>{o+=`<option value="${l(i)}">${l(i)}</option>`}),e.innerHTML=o,e.value=""}function Xt(){let t=document.getElementById("fnbCountNganhHangFilter")?.value||"";K(t),T()}function Gt(){T()}function Yt(t){T()}function zt(){T()}function Jt(){let t=document.getElementById("fnbCountSiteSelect");if(t&&t.value&&t.value!=="all"){try{localStorage.setItem("orbit_user_site",t.value)}catch{}let e=document.getElementById("globalBranchSelect");e&&(e.value=t.value)}typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}function Zt(t){window.gFnbBlindCount=t,T()}function te(t,e){let n=(window.gCurrentCountItems||[]).find(o=>o.code===t);n&&(n.userCount=e===""?0:Number(e),T())}function ee(t,e){let n=(window.gCurrentCountItems||[]).find(o=>o.code===t);n&&(n.userNote=e)}function T(){let t=document.getElementById("fnbCountsTableBody"),e=document.getElementById("fnbCountsMobileCards"),n=(document.getElementById("fnbCountNganhHangFilter")?.value||"").trim().toLowerCase(),o=(document.getElementById("fnbCountNhomHangFilter")?.value||"").trim().toLowerCase(),i=document.getElementById("fnbCountStatusFilter")?.value||"all",s=(document.getElementById("fnbCountSearchInput")?.value||"").trim().toLowerCase(),r=window.gFnbAllItems||[],a=r.filter(c=>{if(n&&(c.nganh_hang||"").trim().toLowerCase()!==n||o&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==o)return!1;if(i!=="all"){let f=Number(c.book_qty)||0,k=(c.userCount!==void 0?Number(c.userCount):c.last_count_qty!==null&&c.last_count_qty!==void 0?Number(c.last_count_qty):f)-f,L=c.userCount!==void 0||c.last_count_qty!==null;if(i==="diff"&&Math.abs(k)<.001||i==="matched"&&Math.abs(k)>=.001||i==="counted"&&!L||i==="uncounted"&&L)return!1}if(s){let f=(c.name||"").toLowerCase(),w=(c.code||"").toLowerCase(),k=(c.nganh_hang||"").toLowerCase(),L=(c.nhom_hang||"").toLowerCase();if(!f.includes(s)&&!w.includes(s)&&!k.includes(s)&&!L.includes(s))return!1}return!0});window.gCurrentCountItems=a;let d=0,u=0,m=0;a.forEach(c=>{let f=Number(c.book_qty)||0,w=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:f,L=(Number(w)||0)-f,C=L*(Number(c.unit_price)||0);Math.abs(L)<.001?d++:u++,m+=C});let y=document.getElementById("fnbCountMetricTotal");y&&(y.textContent=String(a.length));let p=document.getElementById("fnbCountMetricMatched");p&&(p.textContent=String(d));let b=document.getElementById("fnbCountMetricDiff");b&&(b.textContent=String(u));let h=document.getElementById("fnbCountMetricDiffVal");h&&(h.textContent=(m>0?"+":"")+Math.round(m).toLocaleString("vi-VN")+" \u0111"),t&&(a.length===0?!r||r.length===0?t.innerHTML=`<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
            <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nh\u1EADp H\xE0ng \u0110i\u1EC3m B\xE1n</a> tr\u01B0\u1EDBc khi th\u1EF1c hi\u1EC7n ki\u1EC3m k\xEA.</p>
          </div>
        </td></tr>`:t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>':t.innerHTML=a.map((c,f)=>{let w=Number(c.book_qty)||0,k=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:w,L=Number(k)||0,C=L-w,F=C*(Number(c.unit_price)||0),B='<span class="text-gray-400 tabular-nums">0</span>';C>0?B=`<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${C.toFixed(1)}</span>`:C<0&&(B=`<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${C.toFixed(1)}</span>`);let X='<span class="text-gray-400 tabular-nums font-mono">0 \u0111</span>';F>0?X=`<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(F).toLocaleString("vi-VN")} \u0111</span>`:F<0&&(X=`<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(F).toLocaleString("vi-VN")} \u0111</span>`);let se=window.gFnbBlindCount?'<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">\u2022\u2022\u2022\u2022</span>':`<span class="font-bold tabular-nums font-mono ${w<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${w.toFixed(1)}</span>`,ut=c.nhom_hang||c.item_group||"";return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${f+1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${l(c.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${l(c.code)}</span>
                ${ut?`<span>\u2022</span><span class="text-gray-500 dark:text-gray-400">${l(ut)}</span>`:""}
                <span>\u2022</span>
                <span class="font-mono">Gi\xE1: ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${l(c.unit||"")}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${se}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${L}" oninput="onCountInputChange('${l(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${B}</td>
            <td class="py-3 px-3 text-right select-all">${X}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="L\xFD do ch\xEAnh l\u1EC7ch (n\u1EBFu c\xF3)..." value="${l(c.userNote||"")}" oninput="onCountNoteChange('${l(c.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `}).join("")),e&&(a.length===0?!r||r.length===0?e.innerHTML=`<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
          <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nh\u1EADp H\xE0ng</a> tr\u01B0\u1EDBc khi ki\u1EC3m k\xEA.</p>
        </div>`:e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':e.innerHTML=a.map(c=>{let f=Number(c.book_qty)||0,w=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:f,k=Number(w)||0,L=k-f,C=L*(Number(c.unit_price)||0);return`
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${l(c.nhom_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${l(c.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${l(c.code)}</span> \u2022 ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111/${l(c.unit||"")}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">T\u1ED3n s\xE1ch:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${f<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${window.gFnbBlindCount?"\u2022\u2022\u2022\u2022":f.toFixed(1)} ${l(c.unit||"")}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">SL Th\u1EF1c t\u1EBF:</span>
                <input type="number" step="0.1" value="${k}" oninput="onCountInputChange('${l(c.code)}', this.value)"
                       class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 font-bold tabular-nums text-gray-900 dark:text-white outline-none font-mono">
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-0.5">Ch\xEAnh l\u1EC7ch:</span>
                <div class="font-bold text-xs pt-1.5 tabular-nums font-mono ${L>0?"text-emerald-600":L<0?"text-rose-600":"text-gray-400"}">
                  ${L>0?"+":""}${L.toFixed(1)} (${(C>0?"+":"")+Math.round(C).toLocaleString("vi-VN")} \u0111)
                </div>
              </div>
            </div>

            <input type="text" placeholder="Ghi ch\xFA l\xFD do..." value="${l(c.userNote||"")}" oninput="onCountNoteChange('${l(c.code)}', this.value)"
                   class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none">
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function ne(){let t=I(),e=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),n="DAILY",o=window.gCurrentCountItems||[];if(!o||!o.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 l\u01B0u ki\u1EC3m k\xEA!");return}let i=o.map(r=>{let a=Number(r.book_qty)||0,d=r.userCount!==void 0?Number(r.userCount):r.last_count_qty!==null&&r.last_count_qty!==void 0?Number(r.last_count_qty):a,u=d-a,m=u*(Number(r.unit_price)||0);return{item_code:r.code,item_name:r.name,item_group:r.item_group||r.nhom_hang||"NVL",unit:r.unit,unit_price:Number(r.unit_price)||0,book_qty:a,actual_qty:d,count_qty:d,diff_qty:u,diff_value:m,diff_val:m,note:r.userNote||""}}),s={site_code:t,count_date:e,count_type:n,notes:`Ki\u1EC3m k\xEA h\u1EB1ng ng\xE0y \u0111i\u1EC3m ${t}`,lines:i};try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA...");let a=await(await fetch("/api/fnb/counts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();if(!a.success)throw new Error(a.error||"L\u1ED7i khi l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA");typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA ${a.data.count_code} th\xE0nh c\xF4ng!`),typeof window.loadFnbCounts=="function"&&await window.loadFnbCounts()}catch(r){console.error("saveFnbCountAudit error:",r),typeof window.showToast=="function"&&window.showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+r.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function ct(t){let e=t||I();try{let o=await(await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(e)}`)).json(),i=document.getElementById("fnbCountsHistoryBody"),s=document.getElementById("fnbCountsHistoryMobileCards");if((i||s)&&o.success){let r=o.data.counts||[];r.length?(i&&(i.innerHTML=r.map(a=>`
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${a.id})">${l(a.count_code)}</td>
              <td class="py-2.5 px-3 font-semibold">${l(a.site_code)}</td>
              <td class="py-2.5 px-3 tabular-nums">${l(a.count_date)}</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${a.count_type==="DAILY"?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"}">${a.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span></td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono">${a.total_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono ${a.diff_items>0?"text-rose-600 font-bold":"text-emerald-600"}">${a.diff_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${a.diff_value>0||a.diff_value<0?"text-rose-600":"text-emerald-600"}">${Math.round(a.diff_value).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-2.5 px-3 text-gray-400">${l(a.notes||"\u2014")}</td>
            </tr>
          `).join("")),s&&(s.innerHTML=r.map(a=>`
            <div class="data-card cursor-pointer p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2" onclick="viewCountDetail(${a.id})">
              <div class="data-card-header flex items-center justify-between">
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">${l(a.count_code)}</span>
                <span class="badge ${a.count_type==="DAILY"?"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300":"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"} text-xs px-2 py-0.5 rounded-full font-bold">${a.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span>
              </div>
              <div class="data-card-body space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">\u0110i\u1EC3m b\xE1n: <b class="text-gray-700 dark:text-gray-200">${l(a.site_code)}</b></span>
                  <span class="num text-gray-500">${a.count_date}</span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div>
                    <span class="text-gray-400 block text-[11px]">T\u1ED5ng m\xF3n</span>
                    <span class="num font-semibold text-gray-900 dark:text-white font-mono">${a.total_items||0}</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-[11px]">S\u1ED1 l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(a.diff_items)>0?"text-rose-600 dark:text-rose-400":"text-emerald-600"}">${a.diff_items||0}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-gray-400 block text-[11px]">Gi\xE1 tr\u1ECB l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(a.diff_value)!==0?"text-rose-600 dark:text-rose-400":"text-gray-900 dark:text-white"}">${Math.round(Number(a.diff_value)||0).toLocaleString("vi-VN")} \u20AB</span>
                  </div>
                </div>
              </div>
            </div>
          `).join(""))):(i&&(i.innerHTML=`<tr><td colspan="8" class="text-center py-6 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${l(e)}.</td></tr>`),s&&(s.innerHTML=`<div class="card p-6 text-center text-gray-400 text-sm">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${l(e)}.</div>`))}}catch(n){console.error("loadFnbCountsHistory error:",n)}}async function oe(t){try{typeof window.showLoading=="function"&&window.showLoading();let n=await(await fetch(`/api/fnb/counts?id=${t}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu");let o=n.data.lines||[],i=document.getElementById("invDetailModal"),s=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");s&&(s.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Ki\u1EC3m K\xEA #${t}`),r&&(r.textContent=`${o.length} m\u1EB7t h\xE0ng ki\u1EC3m k\xEA`);let a=`
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
            ${o.map(u=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${l(u.item_name||u.item_code)}</td>
                <td class="py-2 px-3 text-right font-mono">${u.book_qty}</td>
                <td class="py-2 px-3 text-right font-bold text-blue-600 font-mono">${u.count_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${u.diff_qty<0?"text-rose-600":u.diff_qty>0?"text-emerald-600":"text-gray-400"}">${u.diff_qty>0?"+":""}${u.diff_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${u.diff_val<0?"text-rose-600":u.diff_val>0?"text-emerald-600":"text-gray-400"}">${u.diff_val>0?"+":""}${Math.round(u.diff_val).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${l(u.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=a),i&&i.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(e){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+e.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function ae(){document.getElementById("invDetailModal")?.classList.add("hidden")}function ie(){let t=window.gCurrentCountItems||[];if(!t||!t.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t phi\u1EBFu ki\u1EC3m!");return}let e=I(),n=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),i=[["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)","T\u1ED3n S\u1ED5 S\xE1ch","S\u1ED1 \u0110\u1EBFm Th\u1EF1c T\u1EBF","Ch\xEAnh L\u1EC7ch","Ghi Ch\xFA"]];if(t.forEach((d,u)=>{let m=Number(d.book_qty)||0,y=d.userCount!==void 0?Number(d.userCount):d.last_count_qty!==null&&d.last_count_qty!==void 0?Number(d.last_count_qty):m,p=y-m;i.push([u+1,d.code,d.name,d.nganh_hang||"",d.nhom_hang||d.item_group||"",d.unit,Number(d.unit_price)||0,m,y,p,d.userNote||""])}),typeof XLSX>"u"){typeof window.showToast=="function"&&window.showToast("Th\u01B0 vi\u1EC7n XLSX ch\u01B0a s\u1EB5n s\xE0ng!");return}let s=XLSX.utils.aoa_to_sheet(i);s["!cols"]=[{wch:6},{wch:15},{wch:32},{wch:20},{wch:22},{wch:8},{wch:14},{wch:14},{wch:16},{wch:14},{wch:25}],s["!autofilter"]={ref:`A1:K${i.length}`},s["!views"]=[{state:"frozen",ySplit:1,xSplit:0}];let r=XLSX.utils.decode_range(s["!ref"]||"A1:K1");for(let d=r.s.r;d<=r.e.r;++d)for(let u=r.s.c;u<=r.e.c;++u){let m=XLSX.utils.encode_cell({r:d,c:u});if(s[m])if(d===0)s[m].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:u===0||u===1?"center":u>=6&&u<=9?"right":"left",wrapText:!1}};else{let y=u===0||u>=6&&u<=9,p=u===1||u===5;s[m].s={font:{name:"Aptos",sz:11,regular:!0,color:{rgb:"000000"}},alignment:{vertical:"center",horizontal:y?"right":p?"center":"left"}}}}let a=XLSX.utils.book_new();XLSX.utils.book_append_sheet(a,s,"PhieuKiemKe"),XLSX.writeFile(a,`Phieu_Kiem_Ke_${e}_${n}.xlsx`),typeof window.showToast=="function"&&window.showToast("\u0110\xE3 xu\u1EA5t phi\u1EBFu ki\u1EC3m k\xEA Excel theo quy chu\u1EA9n Aptos!")}async function de(){let t=I(),e=document.getElementById("fnbCountSiteSelect");e&&e.value!==t&&(e.value=t);let o=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(a=>a.code.toUpperCase()===t.toUpperCase()),i=o?o.ten||o.name:t,s=document.getElementById("fnbCountCurrentSiteBadge");s&&(s.textContent=i);let r=document.getElementById("fnbCountDatePicker");r&&!r.value&&(r.value=new Date().toISOString().slice(0,10));try{typeof window.showLoading=="function"&&window.showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA c\u1EE7a "+t+"...");let d=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();d.success&&d.data?(window.gFnbAllItems=d.data.items||[],U(),T()):(window.gFnbAllItems=[],U(),T()),ct(t)}catch(a){console.error("loadFnbCounts error:",a),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u ki\u1EC3m k\xEA: "+a.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}var v=window;v.gFnbAllItems=v.gFnbAllItems||[];v.gCurrentCountItems=v.gCurrentCountItems||[];v.gFnbBlindCount=v.gFnbBlindCount||!1;v.gFnbNganhMap=v.gFnbNganhMap||null;v.getActiveFnbCountSite=I;v.loadFnbCounts=de;v.populateFnbCountFilters=U;v.populateFnbCountNhomHangDropdown=K;v.onFnbCountNganhHangChange=Xt;v.onFnbCountFilterChange=Gt;v.onFnbCountSearch=Yt;v.onFnbCountDateChange=zt;v.onFnbCountSiteChange=Jt;v.toggleBlindCount=Zt;v.onCountInputChange=te;v.onCountNoteChange=ee;v.renderFnbCountsTable=T;v.saveFnbCountAudit=ne;v.loadFnbCountsHistory=ct;v.viewCountDetail=oe;v.closeInvDetailModal=ae;v.exportCountSheetExcel=ie;console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{St as addManualReceiptItem,Q as addWasteLineRow,we as api,ot as closeConfirmClearManualLinesModal,Z as closeCreateReceiptModal,rt as closeCreateWasteModal,ae as closeInvDetailModal,tt as closeManualReceiptModal,nt as confirmClearAllManualReceiptLines,fe as debounce,l as escapeHtml,Bt as executeClearAllManualReceiptLines,ie as exportCountSheetExcel,N as filterManualCatalogList,G as formatCompactVND,he as formatDateYMD,ye as formatNumber,E as formatReceiptDateYMD,be as formatVND,I as getActiveFnbCountSite,S as getActiveFnbReceiptSite,_ as getActiveFnbWasteSite,M as getReceiptExpWarningHtml,de as loadFnbCounts,ct as loadFnbCountsHistory,$ as loadFnbPoList,pt as loadFnbReceipts,vt as loadFnbReceiptsHistory,re as loadFnbWaste,it as loadFnbWasteHistory,P as loadManualCatalogItems,O as loadWasteModalItems,te as onCountInputChange,ee as onCountNoteChange,zt as onFnbCountDateChange,Gt as onFnbCountFilterChange,Xt as onFnbCountNganhHangChange,Yt as onFnbCountSearch,Jt as onFnbCountSiteChange,gt as onFnbPoSearchInput,Wt as onFnbWasteFilterChange,Ht as onFnbWasteNganhHangChange,Dt as onFnbWasteSearch,Pt as onFnbWasteSiteChange,It as onManualLineBatchChange,Et as onManualLineExpChange,Ft as onManualLineLocChange,Tt as onManualLinePriceChange,_t as onManualLineQtyChange,Ct as onManualReceiptSiteChange,bt as onReceiptLineBatchChange,ht as onReceiptLineExpChange,ft as onReceiptLineNoteChange,mt as onReceiptLineQtyChange,Vt as onWasteLineNoteChange,At as onWasteLineQtyChange,qt as onWasteLineReasonChange,Ut as onWasteModalItemSelect,dt as onWasteModalLineQtyInput,Qt as onWasteModalSiteChange,xt as openCreateReceiptModal,Ot as openCreateWasteModal,kt as openManualReceiptModal,z as openPoReceiptModal,U as populateFnbCountFilters,K as populateFnbCountNhomHangDropdown,st as populateFnbWasteFilters,V as populateFnbWasteNhomHangDropdown,at as populateFnbWasteSiteDropdown,lt as recalculateWasteModalTotal,et as removeManualReceiptLine,T as renderFnbCountsTable,A as renderFnbPoTable,D as renderFnbWasteStockTable,H as renderManualReceiptLinesTable,J as renderReceiptLinesTable,ne as saveFnbCountAudit,$t as setManualLineQuickExp,yt as setReceiptLineQuickExp,wt as submitCreateReceipt,Kt as submitCreateWaste,jt as submitDirectWaste,Nt as submitManualReceipt,R as switchFnbReceiptSubView,W as switchFnbWasteSubView,Zt as toggleBlindCount,Mt as toggleManualShowAllCatalog,q as updateManualTotals,j as updateWasteKPIs,oe as viewCountDetail,Lt as viewReceiptDetail,Rt as viewWasteDetail};
