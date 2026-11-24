function tt(t){return t==null||isNaN(t)?"0 \u20AB":Math.round(t).toLocaleString("vi-VN")+" \u20AB"}function Vt(t){if(t==null||isNaN(t))return{val:"\u2014",unit:"",full:"\u2014"};let n=Number(t),o=Math.abs(n),e=n<0?"-":"",a=n.toLocaleString("vi-VN")+" \u20AB";if(o>=1e9){let i=(o/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:e+i,unit:"t\u1EF7 \u20AB",full:a}}else if(o>=1e6){let i=(o/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:e+i,unit:"tr \u20AB",full:a}}else return{val:e+o.toLocaleString("vi-VN"),unit:"\u20AB",full:a}}function vo(t){if(!t)return"\u2014";if(typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t.trim()))return t.trim();try{let n=new Date(t);if(isNaN(n.getTime()))return String(t);let o=n.getFullYear(),e=String(n.getMonth()+1).padStart(2,"0"),a=String(n.getDate()).padStart(2,"0");return`${o}-${e}-${a}`}catch{return String(t)}}function Ce(t){if(!t)return"\u2014";try{let n=new Date(t);if(isNaN(n.getTime()))return String(t);let o=String(n.getDate()).padStart(2,"0"),e=String(n.getMonth()+1).padStart(2,"0"),a=n.getFullYear();return`${o}/${e}/${a}`}catch{return String(t)}}function et(t,n=1){return t==null||isNaN(t)?"0":Number(t).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:n})}function g(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function ko(t,n=200){let o=null;return function(...e){o&&clearTimeout(o),o=setTimeout(()=>{t.apply(this,e)},n)}}var qt=class{cache=new Map;defaultTtl=3e4;async get(n,o=this.defaultTtl){let e=Date.now(),a=this.cache.get(n);if(a&&e-a.timestamp<o)return e-a.timestamp>1e4&&fetch(n).then(i=>i.json()).then(i=>{i.success&&this.cache.set(n,{timestamp:Date.now(),data:i})}).catch(()=>{}),a.data;try{let s=await(await fetch(n)).json();return s.success&&this.cache.set(n,{timestamp:e,data:s}),s}catch(i){return{success:!1,error:i instanceof Error?i.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(n,o){this.cache.clear();try{return await(await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json()}catch(e){return{success:!1,error:e instanceof Error?e.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(n){if(!n){this.cache.clear();return}for(let o of this.cache.keys())o.includes(n)&&this.cache.delete(o)}async getPoList(n,o="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(n)}&status=${encodeURIComponent(o)}`)}async getPoDetails(n){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(n)}`)}async getReceiptHistory(n){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(n)}`)}async getInventory(n){return this.get(`/api/wh/inventory?site=${encodeURIComponent(n)}`)}async submitManualReceipt(n){return this.post("/api/fnb/manual-receipt",n)}},Co=new qt;function R(){let t=localStorage.getItem("orbit_user_site");if(t)return t.toUpperCase();let n=window,o=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():"K001";return o==="ALL"||!o?"K001":o}function Q(t){if(!t||t==="\u2014")return"\u2014";let n=String(t).trim(),o=n.match(/^(\d{4})-(\d{2})-(\d{2})/);if(o)return`${o[1]}-${o[2]}-${o[3]}`;try{let e=new Date(n);if(!isNaN(e.getTime())){let a=e.getFullYear(),i=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${a}-${i}-${s}`}}catch{}return n.slice(0,10)}function N(t){if(!t)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let n=new Date;n.setHours(0,0,0,0);let o=new Date(t);o.setHours(0,0,0,0);let e=Math.ceil((o.getTime()-n.getTime())/(1e3*60*60*24));return e<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(e)} ng\xE0y)</span>`:e===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':e<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${e} ng\xE0y)</span>`:e<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${e} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${e} ng\xE0y</span>`}function nt(t){window.gFnbReceiptCurrentView=t;let n=document.getElementById("fnbReceiptTabBtnPo"),o=document.getElementById("fnbReceiptTabBtnHistory"),e=document.getElementById("fnbPoListView"),a=document.getElementById("fnbReceiptHistoryView");t==="po"?(n&&(n.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),e&&e.classList.remove("hidden"),a&&a.classList.add("hidden"),K()):(o&&(o.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),a&&a.classList.remove("hidden"),e&&e.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function Se(t){let n=t||R(),o=document.getElementById("fnbReceiptFilterSite");o&&(o.value=n);let a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(r=>r.code.toUpperCase()===n.toUpperCase()),i=a?a.ten||a.name:n,s=document.getElementById("fnbReceiptCurrentSiteBadge");s&&(s.textContent=i),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(n):await K(n)}function Ee(t){vt(t)}async function K(t){let n=t||R(),o=document.getElementById("fnbPoStatusFilter"),e=o?o.value:"OPEN",a=document.getElementById("fnbPoSummaryText");try{a&&(a.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${n}...`);let s=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(n)}&status=${encodeURIComponent(e)}&no-cache=1`)).json();if(s.success&&s.data){window.gFnbPoList=s.data;let r=document.getElementById("fnbPoSearchInput")?.value||"";vt(r);let d=(window.gFnbPoList||[]).filter(u=>u.status==="OPEN").length,l=document.getElementById("fnbReceiptBadgePendingCount");l&&(l.textContent=String(d))}else throw new Error(s.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(i){console.error("loadFnbPoList error:",i),a&&(a.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+i.message)}}function vt(t=""){let n=document.getElementById("fnbPoTableBody"),o=document.getElementById("fnbPoMobileCards"),e=document.getElementById("fnbPoSummaryText"),a=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),i=(t||"").toLowerCase().trim(),s=window.gFnbPoList||[];a&&(s=s.filter(r=>{let d=(r.supplier_name||"").toLowerCase();return a==="siba"?d.includes("siba")||d.includes("b\u1EBFp trung t\xE2m")||d.includes("trung t\xE2m"):a==="baf"?d.includes("baf")||d.includes("th\u1ECBt"):a==="spice"?d.includes("gia v\u1ECB")||d.includes("\u0111\u01B0\u1EDDng")||d.includes("unilever")||d.includes("cholimex")||d.includes("mu\u1ED1i"):a==="veg"?d.includes("rau")||d.includes("\u0111\xE0 l\u1EA1t")||d.includes("c\u1EE7"):!0})),i&&(s=s.filter(r=>{let d=(r.po_number||"").toLowerCase(),l=(r.supplier_name||"").toLowerCase(),u=(r.supplier_code||"").toLowerCase();return d.includes(i)||l.includes(i)||u.includes(i)})),e&&(e.textContent=`Hi\u1EC3n th\u1ECB ${s.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),n&&(s.length===0?n.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':n.innerHTML=s.map(r=>{let d=r.status==="OPEN",l=r.status==="COMPLETED",u=l?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',m=(r.po_number||"").startsWith("50000")||!r.supplier_code||r.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',h=Number(r.total_amount)||0,b=Number(r.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${g(r.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${g(Q(r.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${m}
                <span class="font-medium text-gray-900 dark:text-white">${g(r.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${r.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${g(r.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${r.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${b.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${h>0?Math.round(h).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${u}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${g(r.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${l?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${l?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${l?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),o&&(s.length===0?o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':o.innerHTML=s.map(r=>{let d=r.status==="COMPLETED",l=(r.po_number||"").startsWith("50000")||!r.supplier_code||r.supplier_name==="B\u1EBFp Trung T\xE2m Siba",u=Number(r.total_amount)||0,f=Number(r.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${l?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${l?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${g(r.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${g(r.po_number)} \u2022 ${g(Q(r.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${d?"text-emerald-600":"text-amber-600"} block">${d?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${r.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${f.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${u>0?Math.round(u).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${g(r.po_number)}')" class="w-full py-2 rounded-xl ${d?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${d?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${d?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function Ut(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+t+"...");let o=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}&no-cache=1`)).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let e=o.data;if(!e.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let a=e[0],i=document.getElementById("receiptModalInvoice"),s=document.getElementById("receiptModalInvoiceDisplay"),r=document.getElementById("receiptModalSite"),d=document.getElementById("receiptModalSiteDisplay"),l=document.getElementById("receiptModalSupplier"),u=document.getElementById("receiptModalSupplierDisplay"),f=document.getElementById("receiptModalDate"),m=new Date().toISOString().slice(0,10);i&&(i.value=a.po_number),s&&(s.textContent=a.po_number),r&&(r.value=a.site),d&&(d.textContent=a.site),l&&(l.value=a.supplier_name),u&&(u.textContent=a.supplier_name),f&&(f.value=m);let h="L\xD4-"+m.replace(/-/g,"").slice(2),b=new Date;b.setFullYear(b.getFullYear()+1);let c=b.toISOString().slice(0,10);window.gReceiptLines=e.map(p=>{let x=(p.merch_category||"").toLowerCase(),v=!x.includes("bao b\xEC")&&!x.includes("c\xF4ng c\u1EE5")&&!x.includes("h\xF3a ch\u1EA5t")&&!x.includes("t\u1EA1p ph\u1EA9m");return{po_item:p.po_item,item_code:p.item_code,item_name:p.item_name,merch_category:p.merch_category,unit:p.unit||"KG",unit_price:Number(p.unit_price)||0,order_qty:Number(p.order_qty)||0,actual_qty:Number(p.order_qty)||0,batch_code:h,exp_date:v?c:"",is_food:v,note:""}}),Gt();let y=document.getElementById("createReceiptModal");y&&y.classList.remove("hidden")}catch(n){console.error("openPoReceiptModal error:",n),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Gt(){let t=document.getElementById("receiptLinesTableBody"),n=document.getElementById("receiptLinesMobileCards"),o=document.getElementById("receiptModalLineCount"),e=document.getElementById("receiptModalTotalAmount"),a=window.gReceiptLines||[];o&&(o.textContent=String(a.length));let i=0;t&&(t.innerHTML=a.map((s,r)=>{let d=(s.actual_qty||0)*(s.unit_price||0);return i+=d,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${r+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${g(s.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${g(s.item_code)}</span>
              ${s.merch_category?`<span>\u2022</span><span>${g(s.merch_category)}</span>`:""}
              ${s.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${g(s.unit||"")}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300">
            ${Number(s.unit_price).toLocaleString("vi-VN")} \u0111
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
            ${Number(s.order_qty).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" step="0.01" min="0" value="${s.actual_qty}" 
                   oninput="onReceiptLineQtyChange(${r}, this.value)" 
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="text" value="${g(s.batch_code||"")}" placeholder="L\xF4 SX..." 
                   oninput="onReceiptLineBatchChange(${r}, this.value)" 
                   class="w-28 text-center py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex flex-col items-center">
              <input type="date" id="receiptLineExpInput_${r}" value="${s.exp_date||""}" 
                     onchange="onReceiptLineExpChange(${r}, this.value)" 
                     class="w-32 py-1 px-1.5 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <div class="flex items-center gap-1 mt-1">
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 1)" title="+1 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 6)" title="+6 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 12)" title="+1 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 24)" title="+2 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+2N</button>
              </div>
              <div id="receiptExpWarning_${r}" class="mt-1">
                ${N(s.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${r}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${d>0?Math.round(d).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${g(s.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${r}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=a.map((s,r)=>{let d=(s.actual_qty||0)*(s.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${g(s.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${g(s.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${g(s.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(s.unit_price).toLocaleString("vi-VN")} \u0111</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">#${r+1}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl text-center tabular-nums text-xs">
            <div>
              <span class="text-gray-400 block text-[11px]">SL \u0110\u1EB7t SAP:</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">${Number(s.order_qty).toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Th\xE0nh ti\u1EC1n:</span>
              <span id="receiptLineTotalMob_${r}" class="num font-bold text-brand-600 dark:text-brand-400">${d>0?Math.round(d).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Ph\xE2n lo\u1EA1i:</span>
              <span class="text-xs font-medium">${s.is_food?"Th\u1EF1c ph\u1EA9m":"V\u1EADt t\u01B0"}</span>
            </div>
          </div>

          <div class="space-y-2 pt-1 text-xs">
            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">SL th\u1EF1c nh\u1EADp:</label>
              <input type="number" step="0.01" min="0" value="${s.actual_qty}" 
                     oninput="onReceiptLineQtyChange(${r}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center">
            </div>

            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">S\u1ED1 l\xF4 (Batch):</label>
              <input type="text" value="${g(s.batch_code||"")}" placeholder="L\xF4 SX..." 
                     oninput="onReceiptLineBatchChange(${r}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">H\u1EA1n d\xF9ng (EXP):</label>
                <input type="date" id="receiptLineExpInputMob_${r}" value="${s.exp_date||""}" 
                       onchange="onReceiptLineExpChange(${r}, this.value)" 
                       class="flex-1 py-1 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 outline-none">
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <span class="text-[11px] text-gray-400">Ch\u1ECDn nhanh:</span>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 1)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 6)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 12)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${r}, 24)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+2N</button>
              </div>
              <div id="receiptExpWarningMob_${r}" class="mt-1">
                ${N(s.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${g(s.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${r}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),e&&(e.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function Ie(t,n){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let o=parseFloat(n);window.gReceiptLines[t].actual_qty=isNaN(o)?0:o;let e=window.gReceiptLines[t],a=(e.actual_qty||0)*(e.unit_price||0),i=document.getElementById(`receiptLineTotal_${t}`);i&&(i.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let s=document.getElementById(`receiptLineTotalMob_${t}`);s&&(s.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let r=0;window.gReceiptLines.forEach(l=>{r+=(l.actual_qty||0)*(l.unit_price||0)});let d=document.getElementById("receiptModalTotalAmount");d&&(d.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function Me(t,n){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].batch_code=n)}function Te(t,n){if(!window.gReceiptLines||!window.gReceiptLines[t])return;window.gReceiptLines[t].exp_date=n;let o=document.getElementById(`receiptExpWarning_${t}`);o&&(o.innerHTML=N(n));let e=document.getElementById(`receiptExpWarningMob_${t}`);e&&(e.innerHTML=N(n)),window.lucide&&window.lucide.createIcons()}function $e(t,n){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let o=new Date;o.setMonth(o.getMonth()+n);let e=o.toISOString().slice(0,10);window.gReceiptLines[t].exp_date=e;let a=document.getElementById(`receiptLineExpInput_${t}`);a&&(a.value=e);let i=document.getElementById(`receiptLineExpInputMob_${t}`);i&&(i.value=e);let s=document.getElementById(`receiptExpWarning_${t}`);s&&(s.innerHTML=N(e));let r=document.getElementById(`receiptExpWarningMob_${t}`);r&&(r.innerHTML=N(e)),window.lucide&&window.lucide.createIcons()}function _e(t,n){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].note=n)}function Xt(){let t=document.getElementById("createReceiptModal");t&&t.classList.add("hidden")}function Be(){window.gFnbPoList&&window.gFnbPoList.length?Ut(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function He(){let n=(window.gReceiptLines||[]).filter(m=>(m.actual_qty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let o=new Date;o.setHours(0,0,0,0);let e=!1;for(let m of n)if(m.exp_date){let h=new Date(m.exp_date);if(h.setHours(0,0,0,0),h<=o){e=!0;break}}if(e&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let a=document.getElementById("receiptModalSite")?.value||R(),i=document.getElementById("receiptModalInvoice")?.value||"",s=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),r=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",d=document.getElementById("receiptModalNotes")?.value||"",l=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",u={site_code:a,receipt_date:s,supplier:r,invoice_no:i,notes:d,created_by:l,lines:n.map(m=>({item_code:m.item_code,qty:m.actual_qty,unit_price:m.unit_price,batch_code:(m.batch_code||"").trim(),exp_date:(m.exp_date||"").trim()||null,note:m.note||""}))},f=document.getElementById("btnSubmitReceipt");f&&(f.disabled=!0,f.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let h=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)})).json();if(!h.success)throw new Error(h.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${h.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${a} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Xt(),await K(a),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(a),nt("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(m){console.error("submitCreateReceipt error:",m),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+m.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),f&&(f.disabled=!1,f.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function Ne(t){let n=t||R(),o=document.getElementById("fnbReceiptsTableBody"),e=document.getElementById("fnbReceiptsMobileCards");try{let i=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(n)}&no-cache=1`)).json();if(i.success&&i.data){let s=i.data.receipts||[],r=document.getElementById("fnbReceiptBadgeHistoryCount");r&&(r.textContent=String(s.length)),o&&(s.length?o.innerHTML=s.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${g(d.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${g(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${g(Q(d.receipt_date))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${g(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</td>
              <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${g(d.invoice_no||"\u2014")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-3 px-3 text-gray-500 text-xs">${g(d.created_by||"Th\u1EE7 kho")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewReceiptDetail(${d.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):o.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${g(n)}.</td></tr>`),e&&(s.length?e.innerHTML=s.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${g(d.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${g(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${g(Q(d.receipt_date))} \u2022 PO: ${g(d.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${g(d.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(a){console.error("loadFnbReceiptsHistory error:",a)}}async function Fe(t){try{typeof window.showLoading=="function"&&window.showLoading();let o=await(await fetch(`/api/fnb/receipts?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let e=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${t}`),s&&(s.textContent=`${e.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let r=`
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
            ${e.map(l=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${g(l.item_name||l.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${g(l.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(l.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${g(l.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${l.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${g(l.exp_date?String(l.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(l.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(l.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${g(l.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=r),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function De(t){let n=t||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||R()||"K001",e=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(y=>y.code.toUpperCase()===n.toUpperCase()),a=e?e.ten||e.name:n,i=a.startsWith(n)?a:`${n} - ${a}`,s=document.getElementById("manualReceiptSiteNameDisplay");s&&(s.textContent=i);let r=document.getElementById("manualReceiptSiteSelect");r&&(r.value=n);let d=document.getElementById("manualReceiptSiteBadge");d&&(d.textContent=n);let l=document.getElementById("manualReceiptDate");l&&(l.value=new Date().toISOString().slice(0,10));let u=document.getElementById("manualReceiptSupplier");u&&!u.value&&(u.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let f=document.getElementById("manualReceiptInvoiceNo");f&&(f.value="");let m=document.getElementById("manualReceiptNotes");m&&(m.value="");let h=document.getElementById("manualItemSearchInput");h&&(h.value="");let b=document.getElementById("manualItemCategorySelect");b&&(b.value=""),window.gManualReceiptLines=[],ot();let c=document.getElementById("modalManualReceipt");c&&c.classList.remove("hidden"),await ct(n,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function Qt(){let t=document.getElementById("modalManualReceipt");t&&t.classList.add("hidden")}async function Re(t){let n=document.getElementById("manualReceiptSiteBadge");n&&(n.textContent=t),await ct(t,window.gManualShowAllCatalog)}async function Ae(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let t=document.getElementById("txtToggleManualCatalog");t&&(t.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let n=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await ct(n,window.gManualShowAllCatalog)}async function ct(t,n){let o=document.getElementById("manualCatalogListContainer");o&&(o.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let e=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}${n?"&include_all=1":""}`,i=await(await fetch(e)).json();i.success&&i.data?window.gManualSiteCatalog=i.data.items||[]:window.gManualSiteCatalog=[],Y()}catch(e){console.error("loadManualCatalogItems error:",e),o&&(o.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${g(e.message)}</div>`)}}function Y(){let t=document.getElementById("manualCatalogListContainer"),n=document.getElementById("manualCatalogCountText"),o=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),e=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),a=window.gManualSiteCatalog||[];if(o&&(a=a.filter(i=>{let s=(i.code||i.sku||"").toLowerCase(),r=(i.name||"").toLowerCase();return s.includes(o)||r.includes(o)})),e&&(a=a.filter(i=>(i.nhom_hang||i.item_group||i.nganh_hang||"").toLowerCase().includes(e))),n&&(n.textContent=String(a.length)),!!t){if(!a.length){t.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${o?`v\u1EDBi t\u1EEB kh\xF3a "${g(o)}"`:""}.
      </div>
    `;return}t.innerHTML=a.map(i=>{let s=i.code||i.sku,r=(window.gManualReceiptLines||[]).find(u=>u.item_code===s),d=parseFloat(i.book_qty||0),l=parseFloat(i.unit_price||0);return`
      <div onclick="addManualReceiptItem('${s}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${r?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${g(i.name||s)}">
              ${g(i.name||s)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${g(i.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${g(s)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${d>0?"text-emerald-600":"text-gray-500"} font-mono">${d.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${l>0?Math.round(l).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
          </div>
        </div>
        <div>
          ${r?`
            <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs font-mono">
              <i data-lucide="check" class="w-3 h-3"></i> x${r.qty}
            </span>
          `:`
            <button type="button" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors">
              <i data-lucide="plus" class="w-3 h-3"></i> Th\xEAm
            </button>
          `}
        </div>
      </div>
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function Oe(t){let n=(window.gManualSiteCatalog||[]).find(e=>(e.code||e.sku)===t);if(!n)return;let o=(window.gManualReceiptLines||[]).find(e=>e.item_code===t);if(o)o.qty=Math.round((o.qty+1)*100)/100;else{let a="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),i=new Date;i.setFullYear(i.getFullYear()+1);let s=i.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:n.code||n.sku,item_name:n.name||n.code,unit:n.unit||"Ph\u1EA7n",unit_price:parseFloat(n.unit_price||0),qty:1,batch_code:a,exp_date:s,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}ot(),Y()}function ot(){let t=document.getElementById("manualLinesEmptyState"),n=document.getElementById("manualLinesTableWrapper"),o=document.getElementById("manualLinesMobileCards"),e=document.getElementById("btnClearAllManualLines"),a=document.getElementById("manualLinesTableBody"),i=document.getElementById("manualSelectedCountText"),s=document.getElementById("manualSummaryTotalSkus"),r=document.getElementById("manualSummaryTotalQty"),d=document.getElementById("manualSummaryTotalAmount"),l=window.gManualReceiptLines||[];if(i&&(i.textContent=String(l.length)),s&&(s.textContent=l.length+" m\xE3"),!l.length){t&&t.classList.remove("hidden"),n&&(n.classList.add("hidden"),n.classList.remove("lg:block")),o&&(o.classList.add("hidden"),o.classList.remove("block")),e&&(e.classList.add("hidden"),e.classList.remove("flex")),r&&(r.textContent="0"),d&&(d.textContent="0 \u0111");return}t&&t.classList.add("hidden"),n&&(n.classList.remove("hidden"),n.classList.add("lg:block")),o&&(o.classList.remove("hidden"),o.classList.add("block")),e&&(e.classList.remove("hidden"),e.classList.add("flex"));let u=0,f=0;a&&(a.innerHTML=l.map((m,h)=>{let b=(m.qty||0)*(m.unit_price||0);return u+=m.qty||0,f+=b,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${h+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${g(m.item_name)}">
              ${g(m.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${g(m.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${g(m.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${m.qty}" 
                   oninput="onManualLineQtyChange(${h}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${m.unit_price}" 
                   oninput="onManualLinePriceChange(${h}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${h}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${b>0?Math.round(b).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${g(m.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${h}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${m.exp_date||""}" 
                   onchange="onManualLineExpChange(${h}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${g(m.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${h}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${h})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=l.map((m,h)=>{let b=(m.qty||0)*(m.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${h+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${g(m.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${g(m.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${h})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${g(m.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${m.qty}" 
                     oninput="onManualLineQtyChange(${h}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${m.unit_price}" 
                     oninput="onManualLinePriceChange(${h}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${b>0?Math.round(b).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${g(m.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${h}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${m.exp_date||""}" 
                   onchange="onManualLineExpChange(${h}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),r&&(r.textContent=u>0?Number.isInteger(u)?String(u):u.toFixed(1):"0"),d&&(d.textContent=f>0?Math.round(f).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function Pe(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=parseFloat(n);window.gManualReceiptLines[t].qty=isNaN(o)?0:o,kt()}function je(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=parseFloat(n);window.gManualReceiptLines[t].unit_price=isNaN(o)?0:o,kt()}function kt(){let t=0,n=0;(window.gManualReceiptLines||[]).forEach((a,i)=>{let s=(a.qty||0)*(a.unit_price||0);t+=a.qty||0,n+=s;let r=document.getElementById(`manualLineTotal_${i}`);r&&(r.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let o=document.getElementById("manualSummaryTotalQty"),e=document.getElementById("manualSummaryTotalAmount");o&&(o.textContent=t.toFixed(1)),e&&(e.textContent=Math.round(n).toLocaleString("vi-VN")+" \u0111")}function We(t,n){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].batch_code=n)}function Ve(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;window.gManualReceiptLines[t].exp_date=n;let o=document.getElementById(`manualLineExpWarning_${t}`);o&&(o.innerHTML=N(n),window.lucide&&window.lucide.createIcons())}function qe(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=new Date;o.setMonth(o.getMonth()+n);let e=o.toISOString().slice(0,10);window.gManualReceiptLines[t].exp_date=e;let a=document.getElementById(`manualLineExpInput_${t}`);a&&(a.value=e);let i=document.getElementById(`manualLineExpWarning_${t}`);i&&(i.innerHTML=N(e),window.lucide&&window.lucide.createIcons())}function Ue(t,n){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].storage_loc=n)}function Kt(t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=window.gManualReceiptLines[t];window.gManualReceiptLines.splice(t,1),ot(),typeof Y=="function"&&Y(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(n.item_name||n.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function Jt(){let t=window.gManualReceiptLines||[];if(!t.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let n=document.getElementById("confirmClearManualCountText");n&&(n.textContent=String(t.length));let o=document.getElementById("modalConfirmClearManualLines");o&&(o.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function zt(){let t=document.getElementById("modalConfirmClearManualLines");t&&t.classList.add("hidden")}function Ge(){let t=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],zt(),ot(),Y(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${t} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function Xe(){let n=(window.gManualReceiptLines||[]).filter(b=>(b.qty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let o=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!o){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let e=new Date;e.setHours(0,0,0,0);let a=!1;for(let b of n)if(b.exp_date){let c=new Date(b.exp_date);if(c.setHours(0,0,0,0),c<=e){a=!0;break}}if(a&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let i=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",s=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),r=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",d=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",l=(document.getElementById("manualReceiptNotes")?.value||"").trim(),u=`[${r}] ${l}`.trim(),f=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",m={site_code:i,receipt_date:s,supplier:o,invoice_no:d,notes:u,created_by:f,lines:n.map(b=>({item_code:b.item_code,qty:b.qty,unit_price:b.unit_price,batch_code:(b.batch_code||"").trim(),exp_date:(b.exp_date||"").trim()||null,storage_loc:b.storage_loc||"K\u1EC7 B\u1EBFp",note:b.note||""}))},h=document.getElementById("btnSubmitManualReceipt");h&&(h.disabled=!0,h.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let c=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)})).json();if(!c.success)throw new Error(c.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${c.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${i} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Qt(),await K(i),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(i),nt("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(b){console.error("submitManualReceipt error:",b),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+b.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),h&&(h.disabled=!1,h.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var w=window;w.gFnbReceiptCurrentView=w.gFnbReceiptCurrentView||"po";w.gFnbPoList=w.gFnbPoList||[];w.gReceiptLines=w.gReceiptLines||[];w.gManualReceiptLines=w.gManualReceiptLines||[];w.gManualSiteCatalog=w.gManualSiteCatalog||[];w.gManualShowAllCatalog=w.gManualShowAllCatalog||!1;w.getActiveFnbReceiptSite=R;w.formatReceiptDateYMD=Q;w.getReceiptExpWarningHtml=N;w.switchFnbReceiptSubView=nt;w.loadFnbReceipts=Se;w.onFnbPoSearchInput=Ee;w.loadFnbPoList=K;w.renderFnbPoTable=vt;w.openPoReceiptModal=Ut;w.renderReceiptLinesTable=Gt;w.onReceiptLineQtyChange=Ie;w.onReceiptLineBatchChange=Me;w.onReceiptLineExpChange=Te;w.setReceiptLineQuickExp=$e;w.onReceiptLineNoteChange=_e;w.closeCreateReceiptModal=Xt;w.openCreateReceiptModal=Be;w.submitCreateReceipt=He;w.loadFnbReceiptsHistory=Ne;w.viewReceiptDetail=Fe;w.openManualReceiptModal=De;w.closeManualReceiptModal=Qt;w.onManualReceiptSiteChange=Re;w.toggleManualShowAllCatalog=Ae;w.loadManualCatalogItems=ct;w.filterManualCatalogList=Y;w.addManualReceiptItem=Oe;w.renderManualReceiptLinesTable=ot;w.onManualLineQtyChange=Pe;w.onManualLinePriceChange=je;w.updateManualTotals=kt;w.onManualLineBatchChange=We;w.onManualLineExpChange=Ve;w.setManualLineQuickExp=qe;w.onManualLineLocChange=Ue;w.removeManualReceiptLine=Kt;w.removeManualLine=Kt;w.confirmClearAllManualReceiptLines=Jt;w.clearAllManualReceiptLines=Jt;w.closeConfirmClearManualLinesModal=zt;w.executeClearAllManualReceiptLines=Ge;w.submitManualReceipt=Xe;function A(){let t=document.getElementById("globalBranchSelect")?.value,n=localStorage.getItem("orbit_user_site"),o=window,e=typeof o.App<"u"&&o.App.currentBranch?o.App.currentBranch.toUpperCase():null,a=document.getElementById("fnbWasteFilterSite")?.value,i=t||n||e||a||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function Yt(){let t=document.getElementById("fnbWasteFilterSite");if(!t)return;let n=t.value||A(),o=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(e=>e.code!=="ALL");if(o&&o.length){let e="";o.forEach(a=>{e+=`<option value="${a.code}" ${a.code.toUpperCase()===n.toUpperCase()?"selected":""}>${a.name}</option>`}),t.innerHTML=e,n&&Array.from(t.options).some(a=>a.value===n)&&(t.value=n)}}function at(t){let n=document.getElementById("subtab-fnb-waste-stock"),o=document.getElementById("subtab-fnb-waste-history"),e=document.getElementById("fnbWasteSubViewStock"),a=document.getElementById("fnbWasteSubViewHistory");t==="history"?(n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),e&&e.classList.add("hidden"),a&&a.classList.remove("hidden")):(n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),e&&e.classList.remove("hidden"),a&&a.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function Zt(t){let n=t||A(),o=document.getElementById("fnbWasteTableBody"),e=document.getElementById("fnbWasteMobileCards"),a=document.getElementById("fnbWasteBadgeHistoryCount");try{let s=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(n)}&no-cache=1`)).json();if(s.success&&s.data){let r=s.data.wastes||[];a&&(a.textContent=String(r.length)),o&&(r.length?o.innerHTML=r.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${g(d.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${g(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${g(String(d.waste_date||"").slice(0,10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${g(d.reason||"H\xE0ng h\u1ECFng")}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${g(d.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u20AB</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${g(d.notes||"\u2014")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${d.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi ti\u1EBFt">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):o.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${g(n)}.</td></tr>`),e&&(r.length?e.innerHTML=r.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${g(d.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${g(d.reason||"H\xE0ng h\u1ECFng")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y: ${g(String(d.waste_date||"").slice(0,10))} \u2022 \u0110i\u1EC3m: ${g(d.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u20AB</span>
                  <span class="text-xs text-gray-400">${g(d.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</span>
                </div>
              </div>
            </div>
          `).join(""):e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(i){console.error("loadFnbWasteHistory error:",i)}}async function Qe(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let o=await(await fetch(`/api/fnb/wastes?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let e=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${t}`),s&&(s.textContent=`${e.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let r=`
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
            ${e.map(l=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${g(l.item_name||l.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${g(l.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${g(l.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(l.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(l.unit_price).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(l.amount).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${g(l.reason_detail||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=r),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function te(){let t=document.getElementById("fnbWasteNganhHangFilter"),n=document.getElementById("fnbWasteNhomHangFilter");if(!t||!n)return;let o=new Map;(window.gFnbWasteStockItems||[]).forEach(a=>{let i=(a.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),s=(a.nhom_hang||a.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();o.has(i)||o.set(i,new Set),o.get(i).add(s)}),window.gFnbWasteNganhMap=o;let e='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(o.keys()).sort().forEach(a=>{e+=`<option value="${g(a)}">${g(a)}</option>`}),t.innerHTML=e,t.value="",Lt("")}function Lt(t){let n=document.getElementById("fnbWasteNhomHangFilter");if(!n)return;let o=new Set;window.gFnbWasteNganhMap&&(t&&window.gFnbWasteNganhMap.has(t)?window.gFnbWasteNganhMap.get(t).forEach(a=>o.add(a)):window.gFnbWasteNganhMap.forEach(a=>a.forEach(i=>o.add(i))));let e='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(o).sort().forEach(a=>{e+=`<option value="${g(a)}">${g(a)}</option>`}),n.innerHTML=e,n.value=""}function Ke(){let t=document.getElementById("fnbWasteNganhHangFilter")?.value||"";Lt(t),rt()}function Je(){rt()}function ze(t){rt()}function Ye(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function rt(){let t=document.getElementById("fnbWasteStockTableBody"),n=document.getElementById("fnbWasteStockMobileCards"),o=document.getElementById("fnbWasteStockEmptyState"),e=document.getElementById("fnbWasteSummary"),a=document.getElementById("fnbWasteBadgeInStockCount"),i=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),s=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),r=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),d=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),l=window.gFnbWasteStockItems||[],u=document.getElementById("kpiWasteInStockCount"),f=document.getElementById("kpiWasteInStockVal");u&&(u.textContent=String(l.length));let m=0;if(l.forEach(c=>{m+=Number(c.total_value)||Number(c.book_qty)*Number(c.unit_price)||0}),f){let c=Vt(m);f.innerHTML=`${c.val}<span class="kpi-unit">${c.unit}</span>`}a&&(a.textContent=String(l.length));let h=l.filter(c=>{if(r==="EXP"&&(c.days_remaining!==void 0?Number(c.days_remaining):999)>15&&!c.is_expired||i&&(c.nganh_hang||"").trim().toLowerCase()!==i||s&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==s)return!1;if(d){let y=(c.name||"").toLowerCase(),p=(c.code||"").toLowerCase();if(!y.includes(d)&&!p.includes(d))return!1}return!0});if(e&&(e.textContent=`Hi\u1EC3n th\u1ECB ${h.length} / ${l.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),Ct(),!h.length){t&&(t.innerHTML=""),n&&(n.innerHTML=""),o&&o.classList.remove("hidden");return}o&&o.classList.add("hidden");let b=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];t&&(t.innerHTML=h.map((c,y)=>{let p=Number(c.book_qty)||0,x=Number(c.unit_price)||0,v=Number(c.total_value)||p*x,k=c.wasteQty||0,M=k*x;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${y+1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${g(c.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${g(c.name||c.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${g(c.nganh_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
              ${c.nhom_hang&&c.nhom_hang!==c.nganh_hang?`<span>\u2022</span><span>${g(c.nhom_hang)}</span>`:""}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${g(c.unit||"Ph\u1EA7n")}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(x).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${p.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(v).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${p}" value="${k>0?k:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${g(c.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${g(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${b.map(I=>`<option value="${g(I)}" ${c.wasteReason===I?"selected":""}>${g(I)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${g(c.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${M>0?Math.round(M).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${g(c.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${g(c.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=h.map(c=>{let y=Number(c.book_qty)||0,p=Number(c.unit_price)||0,x=c.wasteQty||0,v=x*p;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${g(c.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${g(c.name||c.code)}</h4>
              <div class="text-xs text-gray-400">${g(c.nganh_hang||c.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${y.toFixed(1)} ${g(c.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(p).toLocaleString("vi-VN")} \u20AB / ${g(c.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${y.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${y}" value="${x>0?x:""}" placeholder="0"
                     oninput="onWasteLineQtyChange('${g(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Th\xE0nh Ti\u1EC1n H\u1EE7y</label>
              <div id="mobWasteLineTotal_${g(c.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${v>0?Math.round(v).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">L\xFD Do H\u1EE7y</label>
            <select onchange="onWasteLineReasonChange('${g(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${b.map(k=>`<option value="${g(k)}" ${c.wasteReason===k?"selected":""}>${g(k)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function Ze(t,n){let o=(window.gFnbWasteStockItems||[]).find(d=>d.code===t);if(!o)return;let e=parseFloat(n),a=Number(o.book_qty)||0;isNaN(e)||e<0?o.wasteQty=0:e>a?(o.wasteQty=a,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${a})`)):o.wasteQty=e;let i=o.wasteQty*(Number(o.unit_price)||0),s=document.getElementById(`wasteLineTotal_${t}`);s&&(s.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let r=document.getElementById(`mobWasteLineTotal_${t}`);r&&(r.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),Ct()}function tn(t,n){let o=(window.gFnbWasteStockItems||[]).find(e=>e.code===t);o&&(o.wasteReason=n)}function en(t,n){let o=(window.gFnbWasteStockItems||[]).find(e=>e.code===t);o&&(o.wasteNote=n)}function Ct(){let t=window.gFnbWasteStockItems||[],n=0,o=0;t.forEach(r=>{r.wasteQty>0&&(n++,o+=r.wasteQty*(Number(r.unit_price)||0))});let e=document.getElementById("kpiWasteSelectedCount");e&&(e.textContent=String(n));let a=document.getElementById("kpiWasteTotalEstAmount");if(a)if(o>0){let r=Vt(o);a.innerHTML=`${r.val}<span class="kpi-unit">${r.unit}</span>`}else a.textContent="0 \u20AB";let i=document.getElementById("btnSubmitDirectWaste"),s=document.getElementById("btnSubmitDirectWasteText");i&&(i.disabled=n===0),s&&(s.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${n})`)}async function nn(){let n=(window.gFnbWasteStockItems||[]).filter(d=>(d.wasteQty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let o=A(),e=new Date().toISOString().slice(0,10),a=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",i=0;n.forEach(d=>{i+=d.wasteQty*(Number(d.unit_price)||0)});let s={site_code:o,waste_date:e,reason:n.length===1?n[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:a,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${n.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:a,lines:n.map(d=>({item_code:d.code,qty:d.wasteQty,unit_price:Number(d.unit_price)||0,reason_detail:d.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:d.wasteNote||""}))},r=document.getElementById("btnSubmitDirectWaste");r&&(r.disabled=!0,r.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let l=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();if(!l.success)throw new Error(l.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${l.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${o} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),at("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(d){console.error("submitDirectWaste error:",d),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+d.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),r&&(r.disabled=!1,r.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function on(){let t=document.getElementById("createWasteModal"),n=A(),o=document.getElementById("wasteModalSite"),e=document.getElementById("wasteModalDate");if(e&&!e.value&&(e.value=new Date().toISOString().slice(0,10)),o){let i="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(s=>{i+=`<option value="${s.code}" ${s.code===n?"selected":""}>${s.ten||s.name}</option>`}),o.innerHTML=i,o.value=n}await St(n);let a=document.getElementById("wasteLinesContainer");a&&(a.innerHTML=""),Et(),t&&t.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function ee(){let t=document.getElementById("createWasteModal");t&&t.classList.add("hidden")}async function an(){let t=document.getElementById("wasteModalSite")?.value||"K001";await St(t);let n=document.getElementById("wasteLinesContainer");n&&(n.innerHTML=""),Et()}async function St(t){try{let o=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=o.success&&o.data?o.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function Et(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let n=window.gWasteModalInStockItems||[],o="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),e='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';n.forEach(i=>{e+=`<option value="${g(i.code)}" data-price="${i.unit_price}" data-unit="${g(i.unit||"")}" data-stock="${i.book_qty}">[${g(i.code)}] ${g(i.name)} (T\u1ED3n: ${Number(i.book_qty).toFixed(1)} ${g(i.unit||"")})</option>`});let a=`
    <div id="${o}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${o}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${e}
        </select>
        <button type="button" onclick="document.getElementById('${o}')?.remove(); recalculateWasteModalTotal();" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">SL H\u1EE7y</label>
          <input type="number" step="0.01" min="0" placeholder="0" oninput="onWasteModalLineQtyInput('${o}', this.value)" class="waste-modal-qty w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold tabular-nums text-center outline-none focus:border-rose-500 font-mono">
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
  `;t.insertAdjacentHTML("beforeend",a),window.lucide&&window.lucide.createIcons()}function rn(t,n){let o=document.getElementById(t);if(!o)return;let e=n.options[n.selectedIndex],a=Number(e?.getAttribute("data-price"))||0,i=Number(e?.getAttribute("data-stock"))||0,s=o.querySelector(".waste-modal-price");s&&(s.textContent=Math.round(a).toLocaleString("vi-VN")+" \u20AB");let r=o.querySelector(".waste-modal-qty");r&&(r.max=String(i),r.placeholder=`T\u1ED1i \u0111a ${i.toFixed(1)}`),ne(t,r?r.value:"0")}function ne(t,n){let o=document.getElementById(t);if(!o)return;let e=o.querySelector("select"),a=e?.options[e.selectedIndex],i=Number(a?.getAttribute("data-price"))||0,r=(parseFloat(n)||0)*i,d=o.querySelector(".waste-modal-amt");d&&(d.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),oe()}function oe(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let n=0;t.querySelectorAll(".p-3").forEach(e=>{let a=e.querySelector("select"),i=a?.options[a.selectedIndex],s=Number(i?.getAttribute("data-price"))||0,r=e.querySelector(".waste-modal-qty"),d=parseFloat(r?.value||"0")||0;n+=d*s});let o=document.getElementById("wasteModalTotalAmount");o&&(o.textContent=n>0?Math.round(n).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function sn(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let n=[];if(t.querySelectorAll(".p-3").forEach(u=>{let f=u.querySelector("select"),m=f?.value,h=f?.options[f.selectedIndex],b=Number(h?.getAttribute("data-price"))||0,c=u.querySelector(".waste-modal-qty"),y=parseFloat(c?.value||"0")||0;m&&y>0&&n.push({item_code:m,qty:y,unit_price:b,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let o=document.getElementById("wasteModalSite")?.value||A(),e=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),a=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",i=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",s=document.getElementById("wasteModalNotes")?.value||"",r=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",d={site_code:o,waste_date:e,reason:a,confirmed_by:i,notes:s,created_by:r,lines:n},l=document.getElementById("btnSubmitWaste");l&&(l.disabled=!0,l.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let f=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)})).json();if(!f.success)throw new Error(f.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${f.data.waste_code}!`),ee(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),at("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(u){console.error("submitCreateWaste error:",u),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+u.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),l&&(l.disabled=!1,l.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function po(){Yt();let t=A(),n=document.getElementById("fnbWasteFilterSite");n&&n.value!==t&&(n.value=t);let o=document.getElementById("fnbWasteSummary");o&&(o.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+t+"...");try{let a=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();a.success&&a.data?window.gFnbWasteStockItems=(a.data.items||[]).map(i=>({...i,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],te(),rt(),Zt(t)}catch(e){console.error("loadFnbWaste error:",e),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+e.message)}}var L=window;L.gFnbWasteStockItems=L.gFnbWasteStockItems||[];L.gFnbWasteNganhMap=L.gFnbWasteNganhMap||null;L.gWasteModalInStockItems=L.gWasteModalInStockItems||[];L.getActiveFnbWasteSite=A;L.populateFnbWasteSiteDropdown=Yt;L.loadFnbWaste=po;L.switchFnbWasteSubView=at;L.populateFnbWasteFilters=te;L.populateFnbWasteNhomHangDropdown=Lt;L.onFnbWasteNganhHangChange=Ke;L.onFnbWasteFilterChange=Je;L.onFnbWasteSearch=ze;L.onFnbWasteSiteChange=Ye;L.renderFnbWasteStockTable=rt;L.onWasteLineQtyChange=Ze;L.onWasteLineReasonChange=tn;L.onWasteLineNoteChange=en;L.updateWasteKPIs=Ct;L.submitDirectWaste=nn;L.loadFnbWasteHistory=Zt;L.viewWasteDetail=Qe;L.openCreateWasteModal=on;L.closeCreateWasteModal=ee;L.onWasteModalSiteChange=an;L.loadWasteModalItems=St;L.addWasteLineRow=Et;L.onWasteModalItemSelect=rn;L.onWasteModalLineQtyInput=ne;L.recalculateWasteModalTotal=oe;L.submitCreateWaste=sn;function W(){let t=localStorage.getItem("orbit_user_site"),n=document.getElementById("globalBranchSelect")?.value,o=window,e=typeof o.App<"u"&&o.App.currentBranch?o.App.currentBranch.toUpperCase():null,a=document.getElementById("fnbCountSiteSelect")?.value,i=t||n||e||a||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function It(){let t=document.getElementById("fnbCountNganhHangFilter"),n=document.getElementById("fnbCountNhomHangFilter");if(!t||!n)return;let o=new Map;(window.gFnbAllItems||[]).forEach(i=>{let s=(i.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),r=(i.nhom_hang||i.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();o.has(s)||o.set(s,new Set),o.get(s).add(r)}),window.gFnbNganhMap=o;let a='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(o.keys()).sort().forEach(i=>{a+=`<option value="${g(i)}">${g(i)}</option>`}),t.innerHTML=a,t.value="",Mt("")}function Mt(t){let n=document.getElementById("fnbCountNhomHangFilter");if(!n)return;let o=new Set;window.gFnbNganhMap&&(t&&window.gFnbNganhMap.has(t)?window.gFnbNganhMap.get(t).forEach(a=>o.add(a)):window.gFnbNganhMap.forEach(a=>a.forEach(i=>o.add(i))));let e='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(o).sort().forEach(a=>{e+=`<option value="${g(a)}">${g(a)}</option>`}),n.innerHTML=e,n.value=""}function dn(){let t=document.getElementById("fnbCountNganhHangFilter")?.value||"";Mt(t),O()}function ln(){O()}function cn(t){O()}function un(){O()}function gn(){let t=document.getElementById("fnbCountSiteSelect");if(t&&t.value&&t.value!=="all"){try{localStorage.setItem("orbit_user_site",t.value)}catch{}let n=document.getElementById("globalBranchSelect");n&&(n.value=t.value)}typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}function pn(t){window.gFnbBlindCount=t,O()}function mn(t,n){let o=(window.gCurrentCountItems||[]).find(e=>e.code===t);o&&(o.userCount=n===""?0:Number(n),O())}function fn(t,n){let o=(window.gCurrentCountItems||[]).find(e=>e.code===t);o&&(o.userNote=n)}function O(){let t=document.getElementById("fnbCountsTableBody"),n=document.getElementById("fnbCountsMobileCards"),o=(document.getElementById("fnbCountNganhHangFilter")?.value||"").trim().toLowerCase(),e=(document.getElementById("fnbCountNhomHangFilter")?.value||"").trim().toLowerCase(),a=document.getElementById("fnbCountStatusFilter")?.value||"all",i=(document.getElementById("fnbCountSearchInput")?.value||"").trim().toLowerCase(),s=window.gFnbAllItems||[],r=s.filter(c=>{if(o&&(c.nganh_hang||"").trim().toLowerCase()!==o||e&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==e)return!1;if(a!=="all"){let y=Number(c.book_qty)||0,x=(c.userCount!==void 0?Number(c.userCount):c.last_count_qty!==null&&c.last_count_qty!==void 0?Number(c.last_count_qty):y)-y,v=c.userCount!==void 0||c.last_count_qty!==null;if(a==="diff"&&Math.abs(x)<.001||a==="matched"&&Math.abs(x)>=.001||a==="counted"&&!v||a==="uncounted"&&v)return!1}if(i){let y=(c.name||"").toLowerCase(),p=(c.code||"").toLowerCase(),x=(c.nganh_hang||"").toLowerCase(),v=(c.nhom_hang||"").toLowerCase();if(!y.includes(i)&&!p.includes(i)&&!x.includes(i)&&!v.includes(i))return!1}return!0});window.gCurrentCountItems=r;let d=0,l=0,u=0;r.forEach(c=>{let y=Number(c.book_qty)||0,p=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:y,v=(Number(p)||0)-y,k=v*(Number(c.unit_price)||0);Math.abs(v)<.001?d++:l++,u+=k});let f=document.getElementById("fnbCountMetricTotal");f&&(f.textContent=String(r.length));let m=document.getElementById("fnbCountMetricMatched");m&&(m.textContent=String(d));let h=document.getElementById("fnbCountMetricDiff");h&&(h.textContent=String(l));let b=document.getElementById("fnbCountMetricDiffVal");b&&(b.textContent=(u>0?"+":"")+Math.round(u).toLocaleString("vi-VN")+" \u0111"),t&&(r.length===0?!s||s.length===0?t.innerHTML=`<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
            <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nh\u1EADp H\xE0ng \u0110i\u1EC3m B\xE1n</a> tr\u01B0\u1EDBc khi th\u1EF1c hi\u1EC7n ki\u1EC3m k\xEA.</p>
          </div>
        </td></tr>`:t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>':t.innerHTML=r.map((c,y)=>{let p=Number(c.book_qty)||0,x=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:p,v=Number(x)||0,k=v-p,M=k*(Number(c.unit_price)||0),I='<span class="text-gray-400 tabular-nums">0</span>';k>0?I=`<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${k.toFixed(1)}</span>`:k<0&&(I=`<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${k.toFixed(1)}</span>`);let D='<span class="text-gray-400 tabular-nums font-mono">0 \u0111</span>';M>0?D=`<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(M).toLocaleString("vi-VN")} \u0111</span>`:M<0&&(D=`<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(M).toLocaleString("vi-VN")} \u0111</span>`);let xt=window.gFnbBlindCount?'<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">\u2022\u2022\u2022\u2022</span>':`<span class="font-bold tabular-nums font-mono ${p<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${p.toFixed(1)}</span>`,Z=c.nhom_hang||c.item_group||"";return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${y+1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${g(c.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${g(c.code)}</span>
                ${Z?`<span>\u2022</span><span class="text-gray-500 dark:text-gray-400">${g(Z)}</span>`:""}
                <span>\u2022</span>
                <span class="font-mono">Gi\xE1: ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${g(c.unit||"")}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${xt}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${v}" oninput="onCountInputChange('${g(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${I}</td>
            <td class="py-3 px-3 text-right select-all">${D}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="L\xFD do ch\xEAnh l\u1EC7ch (n\u1EBFu c\xF3)..." value="${g(c.userNote||"")}" oninput="onCountNoteChange('${g(c.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `}).join("")),n&&(r.length===0?!s||s.length===0?n.innerHTML=`<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
          <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nh\u1EADp H\xE0ng</a> tr\u01B0\u1EDBc khi ki\u1EC3m k\xEA.</p>
        </div>`:n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':n.innerHTML=r.map(c=>{let y=Number(c.book_qty)||0,p=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:y,x=Number(p)||0,v=x-y,k=v*(Number(c.unit_price)||0);return`
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${g(c.nhom_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${g(c.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${g(c.code)}</span> \u2022 ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111/${g(c.unit||"")}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">T\u1ED3n s\xE1ch:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${y<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${window.gFnbBlindCount?"\u2022\u2022\u2022\u2022":y.toFixed(1)} ${g(c.unit||"")}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">SL Th\u1EF1c t\u1EBF:</span>
                <input type="number" step="0.1" value="${x}" oninput="onCountInputChange('${g(c.code)}', this.value)"
                       class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 font-bold tabular-nums text-gray-900 dark:text-white outline-none font-mono">
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-0.5">Ch\xEAnh l\u1EC7ch:</span>
                <div class="font-bold text-xs pt-1.5 tabular-nums font-mono ${v>0?"text-emerald-600":v<0?"text-rose-600":"text-gray-400"}">
                  ${v>0?"+":""}${v.toFixed(1)} (${(k>0?"+":"")+Math.round(k).toLocaleString("vi-VN")} \u0111)
                </div>
              </div>
            </div>

            <input type="text" placeholder="Ghi ch\xFA l\xFD do..." value="${g(c.userNote||"")}" oninput="onCountNoteChange('${g(c.code)}', this.value)"
                   class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none">
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function hn(){let t=W(),n=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),o="DAILY",e=window.gCurrentCountItems||[];if(!e||!e.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 l\u01B0u ki\u1EC3m k\xEA!");return}let a=e.map(s=>{let r=Number(s.book_qty)||0,d=s.userCount!==void 0?Number(s.userCount):s.last_count_qty!==null&&s.last_count_qty!==void 0?Number(s.last_count_qty):r,l=d-r,u=l*(Number(s.unit_price)||0);return{item_code:s.code,item_name:s.name,item_group:s.item_group||s.nhom_hang||"NVL",unit:s.unit,unit_price:Number(s.unit_price)||0,book_qty:r,actual_qty:d,count_qty:d,diff_qty:l,diff_value:u,diff_val:u,note:s.userNote||""}}),i={site_code:t,count_date:n,count_type:o,notes:`Ki\u1EC3m k\xEA h\u1EB1ng ng\xE0y \u0111i\u1EC3m ${t}`,lines:a};try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA...");let r=await(await fetch("/api/fnb/counts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();if(!r.success)throw new Error(r.error||"L\u1ED7i khi l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA");typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA ${r.data.count_code} th\xE0nh c\xF4ng!`),typeof window.loadFnbCounts=="function"&&await window.loadFnbCounts()}catch(s){console.error("saveFnbCountAudit error:",s),typeof window.showToast=="function"&&window.showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+s.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function ae(t){let n=t||W();try{let e=await(await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(n)}`)).json(),a=document.getElementById("fnbCountsHistoryBody"),i=document.getElementById("fnbCountsHistoryMobileCards");if((a||i)&&e.success){let s=e.data.counts||[];s.length?(a&&(a.innerHTML=s.map(r=>`
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${r.id})">${g(r.count_code)}</td>
              <td class="py-2.5 px-3 font-semibold">${g(r.site_code)}</td>
              <td class="py-2.5 px-3 tabular-nums">${g(r.count_date)}</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${r.count_type==="DAILY"?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"}">${r.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span></td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono">${r.total_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono ${r.diff_items>0?"text-rose-600 font-bold":"text-emerald-600"}">${r.diff_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${r.diff_value>0||r.diff_value<0?"text-rose-600":"text-emerald-600"}">${Math.round(r.diff_value).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-2.5 px-3 text-gray-400">${g(r.notes||"\u2014")}</td>
            </tr>
          `).join("")),i&&(i.innerHTML=s.map(r=>`
            <div class="data-card cursor-pointer p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2" onclick="viewCountDetail(${r.id})">
              <div class="data-card-header flex items-center justify-between">
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">${g(r.count_code)}</span>
                <span class="badge ${r.count_type==="DAILY"?"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300":"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"} text-xs px-2 py-0.5 rounded-full font-bold">${r.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span>
              </div>
              <div class="data-card-body space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">\u0110i\u1EC3m b\xE1n: <b class="text-gray-700 dark:text-gray-200">${g(r.site_code)}</b></span>
                  <span class="num text-gray-500">${r.count_date}</span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div>
                    <span class="text-gray-400 block text-[11px]">T\u1ED5ng m\xF3n</span>
                    <span class="num font-semibold text-gray-900 dark:text-white font-mono">${r.total_items||0}</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-[11px]">S\u1ED1 l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(r.diff_items)>0?"text-rose-600 dark:text-rose-400":"text-emerald-600"}">${r.diff_items||0}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-gray-400 block text-[11px]">Gi\xE1 tr\u1ECB l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(r.diff_value)!==0?"text-rose-600 dark:text-rose-400":"text-gray-900 dark:text-white"}">${Math.round(Number(r.diff_value)||0).toLocaleString("vi-VN")} \u20AB</span>
                  </div>
                </div>
              </div>
            </div>
          `).join(""))):(a&&(a.innerHTML=`<tr><td colspan="8" class="text-center py-6 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${g(n)}.</td></tr>`),i&&(i.innerHTML=`<div class="card p-6 text-center text-gray-400 text-sm">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${g(n)}.</div>`))}}catch(o){console.error("loadFnbCountsHistory error:",o)}}async function bn(t){try{typeof window.showLoading=="function"&&window.showLoading();let o=await(await fetch(`/api/fnb/counts?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu");let e=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),s=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Ki\u1EC3m K\xEA #${t}`),s&&(s.textContent=`${e.length} m\u1EB7t h\xE0ng ki\u1EC3m k\xEA`);let r=`
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
            ${e.map(l=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${g(l.item_name||l.item_code)}</td>
                <td class="py-2 px-3 text-right font-mono">${l.book_qty}</td>
                <td class="py-2 px-3 text-right font-bold text-blue-600 font-mono">${l.count_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${l.diff_qty<0?"text-rose-600":l.diff_qty>0?"text-emerald-600":"text-gray-400"}">${l.diff_qty>0?"+":""}${l.diff_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${l.diff_val<0?"text-rose-600":l.diff_val>0?"text-emerald-600":"text-gray-400"}">${l.diff_val>0?"+":""}${Math.round(l.diff_val).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${g(l.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=r),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function yn(){document.getElementById("invDetailModal")?.classList.add("hidden")}function xn(){let t=window.gCurrentCountItems||[];if(!t||!t.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t phi\u1EBFu ki\u1EC3m!");return}let n=W(),o=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),a=[["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)","T\u1ED3n S\u1ED5 S\xE1ch","S\u1ED1 \u0110\u1EBFm Th\u1EF1c T\u1EBF","Ch\xEAnh L\u1EC7ch","Ghi Ch\xFA"]];if(t.forEach((d,l)=>{let u=Number(d.book_qty)||0,f=d.userCount!==void 0?Number(d.userCount):d.last_count_qty!==null&&d.last_count_qty!==void 0?Number(d.last_count_qty):u,m=f-u;a.push([l+1,d.code,d.name,d.nganh_hang||"",d.nhom_hang||d.item_group||"",d.unit,Number(d.unit_price)||0,u,f,m,d.userNote||""])}),typeof XLSX>"u"){typeof window.showToast=="function"&&window.showToast("Th\u01B0 vi\u1EC7n XLSX ch\u01B0a s\u1EB5n s\xE0ng!");return}let i=XLSX.utils.aoa_to_sheet(a);i["!cols"]=[{wch:6},{wch:15},{wch:32},{wch:20},{wch:22},{wch:8},{wch:14},{wch:14},{wch:16},{wch:14},{wch:25}],i["!autofilter"]={ref:`A1:K${a.length}`},i["!views"]=[{state:"frozen",ySplit:1,xSplit:0}];let s=XLSX.utils.decode_range(i["!ref"]||"A1:K1");for(let d=s.s.r;d<=s.e.r;++d)for(let l=s.s.c;l<=s.e.c;++l){let u=XLSX.utils.encode_cell({r:d,c:l});if(i[u])if(d===0)i[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:l===0||l===1?"center":l>=6&&l<=9?"right":"left",wrapText:!1}};else{let f=l===0||l>=6&&l<=9,m=l===1||l===5;i[u].s={font:{name:"Aptos",sz:11,regular:!0,color:{rgb:"000000"}},alignment:{vertical:"center",horizontal:f?"right":m?"center":"left"}}}}let r=XLSX.utils.book_new();XLSX.utils.book_append_sheet(r,i,"PhieuKiemKe"),XLSX.writeFile(r,`Phieu_Kiem_Ke_${n}_${o}.xlsx`),typeof window.showToast=="function"&&window.showToast("\u0110\xE3 xu\u1EA5t phi\u1EBFu ki\u1EC3m k\xEA Excel theo quy chu\u1EA9n Aptos!")}async function mo(){let t=W(),n=document.getElementById("fnbCountSiteSelect");n&&n.value!==t&&(n.value=t);let e=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(r=>r.code.toUpperCase()===t.toUpperCase()),a=e?e.ten||e.name:t,i=document.getElementById("fnbCountCurrentSiteBadge");i&&(i.textContent=a);let s=document.getElementById("fnbCountDatePicker");s&&!s.value&&(s.value=new Date().toISOString().slice(0,10));try{typeof window.showLoading=="function"&&window.showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA c\u1EE7a "+t+"...");let d=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();d.success&&d.data?(window.gFnbAllItems=d.data.items||[],It(),O()):(window.gFnbAllItems=[],It(),O()),ae(t)}catch(r){console.error("loadFnbCounts error:",r),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u ki\u1EC3m k\xEA: "+r.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}var S=window;S.gFnbAllItems=S.gFnbAllItems||[];S.gCurrentCountItems=S.gCurrentCountItems||[];S.gFnbBlindCount=S.gFnbBlindCount||!1;S.gFnbNganhMap=S.gFnbNganhMap||null;S.getActiveFnbCountSite=W;S.loadFnbCounts=mo;S.populateFnbCountFilters=It;S.populateFnbCountNhomHangDropdown=Mt;S.onFnbCountNganhHangChange=dn;S.onFnbCountFilterChange=ln;S.onFnbCountSearch=cn;S.onFnbCountDateChange=un;S.onFnbCountSiteChange=gn;S.toggleBlindCount=pn;S.onCountInputChange=mn;S.onCountNoteChange=fn;S.renderFnbCountsTable=O;S.saveFnbCountAudit=hn;S.loadFnbCountsHistory=ae;S.viewCountDetail=bn;S.closeInvDetailModal=yn;S.exportCountSheetExcel=xn;function Tt(t){if(!t||!t.rows||t.rows.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}try{let n=t.sites||[],o=t.rows||[],e=t.groups||{},a=["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)"];n.forEach(f=>{a.push(f.ten||f.name||f.code)});let i=[a];o.forEach((f,m)=>{let h=e[f.group]||f.group,b=[m+1,f.code,f.name,h,f.unit,f.price||0];n.forEach(c=>{let y=f.cells?f.cells[c.id]:void 0;b.push(y&&y.book||0)}),i.push(b)});let s=XLSX.utils.aoa_to_sheet(i),r=XLSX.utils.decode_range(s["!ref"]),d=[{wch:6},{wch:14},{wch:32},{wch:18},{wch:8},{wch:14}];n.forEach(()=>d.push({wch:16})),s["!cols"]=d;for(let f=r.s.r;f<=r.e.r;++f)for(let m=r.s.c;m<=r.e.c;++m){let h=XLSX.utils.encode_cell({r:f,c:m});if(!s[h])continue;if(f===0)s[h].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"CCCCCC"}},bottom:{style:"medium",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"CCCCCC"}},right:{style:"thin",color:{rgb:"CCCCCC"}}}};else{let c="left",y;m===0||m===1||m===4?c="center":(m===5||m>=6)&&(c="right",y="#,##0.00");let p=m>=6&&typeof s[h].v=="number"&&s[h].v<0;s[h].s={font:{name:"Aptos",sz:11,bold:p,color:{rgb:p?"C00000":"000000"}},alignment:{horizontal:c,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E5E5E5"}},bottom:{style:"thin",color:{rgb:"E5E5E5"}},left:{style:"thin",color:{rgb:"E5E5E5"}},right:{style:"thin",color:{rgb:"E5E5E5"}}}},y&&typeof s[h].v=="number"&&(s[h].z=y)}}s["!autofilter"]={ref:s["!ref"]},s["!freeze"]={xSplit:3,ySplit:1,topLeftCell:"D2",activePane:"bottomRight",state:"frozen"};let l=XLSX.utils.book_new();XLSX.utils.book_append_sheet(l,s,"T\u1ED3n Kho Chu\u1ED7i F&B");let u=new Date().toISOString().slice(0,10).replace(/-/g,"");XLSX.writeFile(l,`Ton_Kho_F&B_Chuoi_${u}.xlsx`),typeof showToast=="function"&&showToast("Xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho F&B th\xE0nh c\xF4ng (Font Aptos)!")}catch(n){console.error("Export Excel error:",n),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+(n?.message||n))}}var P=null,$={site:"ALL",group:"ALL",search:"",showValue:!1},$t="";async function re(){try{typeof showLoading=="function"&&showLoading();let t=new URL("/api/fnb/stock",window.location.origin);$.site&&$.site!=="ALL"&&$.site!=="all"&&t.searchParams.set("site_code",$.site),$.region&&$.region!=="ALL"&&t.searchParams.set("regionId",$.region),$.group&&$.group!=="ALL"&&t.searchParams.set("group",$.group),t.searchParams.set("refresh","true");let o=await(await fetch(t.toString())).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c d\u1EEF li\u1EC7u t\u1ED3n kho F&B");P=o.data,window.gFnbStockData=P,ut()}catch(t){console.error("Error loadFnbStock:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i t\u1ED3n kho F&B: "+(t?.message||t))}finally{typeof hideLoading=="function"&&hideLoading()}}function ut(){if(!P)return;let t=P.sites||[],n=P.rows||[],o=P.groups||{},e=($t||"").trim().toLowerCase(),a=n.filter(p=>{if(!e)return!0;let x=(p.name||"").toLowerCase().includes(e),v=(p.code||"").toLowerCase().includes(e);return x||v}),i=$.site,s=a;i&&i!=="ALL"&&i!=="all"&&(s=a.filter(p=>{let x=p.cells&&p.cells[i];return x&&(x.hasSiteRecord||x.book!==void 0&&Number(x.book)!==0||x.lastCount!==null&&x.lastCount!==void 0)}));let r=0,d=0,l=0;a.forEach(p=>{t.forEach(x=>{let v=p.cells&&p.cells[x.id];if(v){let k=Number(v.value)||0,M=Number(v.book)||0;r+=k,M<0&&d++,v.noOpening&&l++}})});let u=document.getElementById("fnbStockKpiTotalItems"),f=document.getElementById("fnbStockKpiTotalValue"),m=document.getElementById("fnbStockKpiNegative"),h=document.getElementById("fnbStockKpiNoOpening");u&&(u.textContent=s.length.toLocaleString("vi-VN")),f&&(f.textContent=Math.round(r).toLocaleString("vi-VN")+" \u0111"),m&&(m.textContent=d.toLocaleString("vi-VN")),h&&(h.textContent=l.toLocaleString("vi-VN"));let b=document.getElementById("fnbStockTableHead");if(b){let p=`
      <tr>
        <th class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">STT</th>
        <th class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-white/3 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">M\u1EB7t H\xE0ng F&amp;B</th>
        <th class="py-3 px-3 text-center w-16 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">\u0110VT</th>
    `;t.forEach(x=>{let v=x.region==="Mi\u1EC1n Nam";p+=`
        <th class="py-3 px-3 text-right font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 min-w-[125px]">
          <div class="flex items-center justify-end gap-1.5">
            <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${v?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${v?"MN":"MB"}</span>
            <span title="${x.name}" class="text-gray-800 dark:text-gray-200">${x.code}</span>
          </div>
          <div class="text-xs font-normal text-gray-400 truncate max-w-[115px]" title="${x.name}">${x.name}</div>
        </th>
      `}),p+="</tr>",b.innerHTML=p}let c=document.getElementById("fnbStockTableBody");c&&(s.length===0?c.innerHTML=`<tr><td colspan="${t.length+3}" class="text-center py-12 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>`:c.innerHTML=s.map((p,x)=>{let v=o[p.group]||p.group,k=`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${x+1}</td>
            <td class="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-white/3 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${v}</span>
                <span class="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">${p.name}</span>
              </div>
              <div class="text-xs tabular-nums text-gray-400 mt-0.5 flex items-center gap-2">
                <span>${p.code}</span>
                <span>\u2022</span>
                <span>Gi\xE1: ${p.price?Number(p.price).toLocaleString("vi-VN")+" \u0111":"--"}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-medium text-gray-600 dark:text-gray-300 text-xs">${p.unit}</td>
        `;return t.forEach(M=>{let I=p.cells&&p.cells[M.id]||{book:0,lastCount:null,noOpening:!0,value:0},D=Number(I.book)||0,Z=D<0?"text-rose-600 dark:text-rose-400 font-semibold":D>0?"text-gray-900 dark:text-white font-bold":"text-gray-400 dark:text-gray-600 font-medium",lt="";if(I.lastCount!==null&&I.lastCount!==void 0&&I.lastCount!==""){let wt=Number(I.lastCount);if(!isNaN(wt)){let Le=Number.isInteger(wt)?wt.toLocaleString("vi-VN"):wt.toFixed(1);lt=` <span class="text-gray-400 dark:text-gray-500 font-normal text-xs" title="\u0110\u1EBFm g\u1EA7n nh\u1EA5t (${I.lastDate||"N/A"}): ${Le}">(${Le})</span>`}}let z="";I.noOpening&&(z='<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" title="Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u"></span>');let Wt="",ke=Number(I.value)||0;$.showValue&&ke&&(Wt=`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums mt-0.5">${Math.round(ke).toLocaleString("vi-VN")} \u0111</div>`);let go=Number.isInteger(D)?D.toLocaleString("vi-VN"):D.toFixed(1);k+=`
            <td class="py-3 px-3 text-right tabular-nums text-xs select-all">
              <div class="flex items-center justify-end">
                ${z}
                <span class="${Z}">${go}</span>${lt}
              </div>
              ${Wt}
            </td>
          `}),k+="</tr>",k}).join(""));let y=document.getElementById("fnbStockMobileCards");y&&(s.length===0?y.innerHTML='<div class="text-center py-10 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':y.innerHTML=a.map(p=>{let x=o[p.group]||p.group,v=t.map(k=>{let M=p.cells&&p.cells[k.id]||{book:0,lastCount:null,noOpening:!0,value:0},I=Number(M.book)||0,D=I<0,xt=I===0,Z=Number.isInteger(I)?I.toLocaleString("vi-VN"):I.toFixed(1),lt="";if(M.lastCount!==null&&M.lastCount!==void 0&&M.lastCount!==""){let z=Number(M.lastCount);isNaN(z)||(lt=`(${Number.isInteger(z)?z.toLocaleString("vi-VN"):z.toFixed(1)})`)}return{site:k,cell:M,isNeg:D,isZero:xt,bookFormatted:Z,countText:lt}});return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${x}</span>
                  <span class="text-xs tabular-nums text-gray-400 font-bold">${p.code}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">${p.name}</h4>
              </div>
              <div class="text-right shrink-0">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold tabular-nums">${p.unit}</span>
                <div class="text-xs text-gray-400 tabular-nums mt-1">${p.price?Number(p.price).toLocaleString("vi-VN")+" \u0111":""}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              ${v.map(k=>{let M=k.site.region==="Mi\u1EC1n Nam";return`
                  <div class="p-2.5 rounded-xl ${k.isNeg?"bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40":k.isZero?"bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/60":"bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60"}">
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${k.site.code}</span>
                      <span class="text-[8.5px] px-1 rounded font-semibold ${M?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${M?"MN":"MB"}</span>
                    </div>
                    <div class="flex items-baseline justify-between tabular-nums">
                      <span class="text-xs text-gray-400">T\u1ED3n:</span>
                      <span class="${k.isNeg?"text-rose-600 dark:text-rose-400 font-semibold text-sm":k.isZero?"text-gray-400 font-medium":"text-gray-900 dark:text-white font-bold text-sm"}">${k.bookFormatted} <span class="text-xs text-gray-400 font-normal">${k.countText}</span></span>
                    </div>
                    ${k.cell.noOpening?'<div class="text-xs text-amber-500 font-semibold mt-0.5">\u26A0\uFE0F Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u</div>':""}
                    ${$.showValue&&k.cell.value?`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums text-right mt-0.5">${Math.round(k.cell.value).toLocaleString("vi-VN")} \u0111</div>`:""}
                  </div>
                `}).join("")}
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function wn(){let t=document.getElementById("fnbStockFilterRegion"),n=document.getElementById("fnbStockFilterGroup"),o=document.getElementById("fnbStockFilterSite");o&&($.site=o.value),t&&($.region=t.value),n&&($.group=n.value),re()}function vn(t){$t=t,ut()}function kn(t){$.showValue=t,ut()}function Wa(){Tt(P)}var j=window;j.gFnbStockData=P;j.gFnbStockFilter=$;j.gFnbStockSearchTerm=$t;j.loadFnbStock=re;j.renderFnbStock=ut;j.onFnbStockFilterChange=wn;j.onFnbStockSearch=vn;j.onFnbStockToggleValue=kn;j.exportFnbStockExcel=()=>Tt(j.gFnbStockData||P);function se(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function ie(t,n){return typeof window.cellBadge=="function"?window.cellBadge(t,n):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${n}</span>`}function de(t){if(typeof window.escapeHtml=="function")return window.escapeHtml(t);let n=document.createElement("div");return n.textContent=t||"",n.innerHTML}function T(t){return typeof window.fmtVND=="function"?window.fmtVND(t):tt(Number(t)||0)}function le(t){return typeof window.fmtNum=="function"?window.fmtNum(t):et(Number(t)||0)}function V(){let t=window;return t.App||(t.App={}),t.App.items||(t.App.items=[]),t.App.items}function _t(t){let n=window;n.App||(n.App={}),n.App.items=t}function gt(){let t=document.getElementById("dinhMucBody"),n=document.getElementById("orderMobileCards"),o=(document.getElementById("orderSearch")?.value||"").toLowerCase(),e=document.getElementById("fLoai")?.value||"",a=document.getElementById("fChiNhap")?.checked,i=document.getElementById("orderSupplyChannel")?.value||"ALL",r=V().filter(l=>{if(o&&!l.maHang.toLowerCase().includes(o)&&!l.tenSP.toLowerCase().includes(o)||e&&l.tenLoai!==e||a&&(!l.soLuongDat||l.soLuongDat<=0))return!1;if(i==="BTT"){let u=((l.nguonCung||"")+" "+(l.tenLoai||"")+" "+(l.tenSP||"")).toLowerCase();if(!u.includes("btt")&&!u.includes("trung t\xE2m")&&!u.includes("ch\u1EBF bi\u1EBFn"))return!1}else if(i==="NCC"){let u=((l.nguonCung||"")+" "+(l.tenLoai||"")).toLowerCase();if(u.includes("btt")||u.includes("trung t\xE2m"))return!1}else if(i==="URGENT"){let u=((l.nganh_hang||"")+" "+(l.tenLoai||"")+" "+(l.tenSP||"")).toLowerCase();if(!u.includes("t\u01B0\u01A1i")&&!u.includes("th\u1ECBt")&&!u.includes("rau")&&!u.includes("kh\u1EA9n"))return!1}return!0});if(!r.length){t&&(t.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</td></tr>'),n&&(n.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</div>');return}let d=window.innerWidth>=1024;t&&(d?t.innerHTML=r.map(l=>{let u=l.soLuongDat||"",f=(l.soLuongDat||0)*(l.donGia||0);return`
          <tr>
            <td class="col-code">${se(l.maHang)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white">${l.tenSP}</span></td>
            <td>${ie("neutral",l.tenLoai||"CCDC")}</td>
            <td>${l.dvt||"C\xE1i"}</td>
            <td class="col-num"><span class="num">${T(l.donGia)}</span></td>
            <td class="col-num"><span class="num">${le(l.daDat)}</span></td>
            <td class="col-num text-right">
              <input type="number" min="0" value="${u}" placeholder="0" class="input h-8 w-24 text-right num"
                oninput="onQtyChange('${l.maHang}', this.value)">
            </td>
            <td class="col-num font-semibold text-brand-600 dark:text-brand-400" id="subtotal-${l.maHang}">${T(f)}</td>
          </tr>
        `}).join(""):t.innerHTML=""),n&&(d?n.innerHTML="":n.innerHTML=r.map(l=>{let u=l.soLuongDat||"",f=(l.soLuongDat||0)*(l.donGia||0);return`
          <div class="data-card space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  ${se(l.maHang)}
                  ${ie("neutral",l.tenLoai||"CCDC")}
                  <span class="text-xs text-gray-500">\u0110VT: ${l.dvt||"C\xE1i"}</span>
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${l.tenSP}</h4>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <div>
                <span class="text-xs text-gray-400">\u0110\u01A1n gi\xE1:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${T(l.donGia)}</div>
              </div>
              <div>
                <span class="text-xs text-gray-400">\u0110\xE3 \u0111\u1EB7t l\u0169y k\u1EBF:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${le(l.daDat)}</div>
              </div>
              <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <div class="flex-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">S\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t:</label>
                  <input type="number" min="0" value="${u}" placeholder="0" class="input h-10 w-full text-center num text-sm font-semibold"
                    oninput="onQtyChange('${l.maHang}', this.value)">
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-400">Th\xE0nh ti\u1EC1n:</span>
                  <div class="text-base font-semibold text-brand-600 dark:text-brand-400 num" id="mob-subtotal-${l.maHang}">${T(f)}</div>
                </div>
              </div>
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Ln(){gt()}function Cn(t,n){let e=V().find(a=>a.maHang===t);if(e){e.soLuongDat=Number(n)||0;let a=document.getElementById(`subtotal-${t}`);a&&(a.textContent=T(e.soLuongDat*(e.donGia||0)));let i=document.getElementById(`mob-subtotal-${t}`);i&&(i.textContent=T(e.soLuongDat*(e.donGia||0))),document.querySelectorAll(`input[oninput*="'${t}'"]`).forEach(s=>{s.value!==n&&(s.value=n)})}pt()}function pt(t,n){let o=document.getElementById("kpiNganSach"),e=document.getElementById("kpiDaDat"),a=t!==void 0?Number(t):Number(o?.dataset?.raw)||Number((o?.textContent||"").replace(/[^\d]/g,""))||0,i=n!==void 0?Number(n):Number(e?.dataset?.raw)||Number((e?.textContent||"").replace(/[^\d]/g,""))||0,r=V().reduce((v,k)=>v+(k.soLuongDat||0)*(k.donGia||0),0),d=i+r,l=a-d,u=a>0?Math.round(d/a*100):0,f=document.getElementById("kpiConLai");f&&(f.dataset.raw=String(l),f.textContent=T(l),f.title=T(l),l<0?(f.classList.remove("text-gray-900","dark:text-white"),f.classList.add("text-rose-600","dark:text-rose-400")):(f.classList.remove("text-rose-600","dark:text-rose-400"),f.classList.add("text-gray-900","dark:text-white")));let m=document.getElementById("kpiDangNhapSub");m&&(m.textContent="\u0110ang nh\u1EADp: "+T(r));let h=document.getElementById("kpiConLaiDelta");h&&(l<0?(h.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",h.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>\xC2m h\u1EA1n m\u1EE9c</span>'):(h.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",h.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>Kh\u1EA3 d\u1EE5ng</span>'));let b=document.getElementById("kpiTyLe");b&&(b.textContent=u+"%",u>100?b.className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums tracking-tight num":u>80?b.className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums tracking-tight num":b.className="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-white tabular-nums tracking-tight num");let c=document.getElementById("budUsed");c&&(c.textContent=T(d));let y=document.getElementById("budFill"),p=document.getElementById("budBadge"),x=document.getElementById("budNote");y&&(y.style.width=Math.min(u,100)+"%",u>100?(y.className="h-full rounded-full bg-rose-500 transition-all duration-300",p&&(p.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",p.innerHTML=`<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>V\u01B0\u1EE3t ${u-100}%</span>`),x&&(x.innerHTML=`<span class="text-rose-600 dark:text-rose-400 font-semibold">\u26A0\uFE0F V\u01B0\u1EE3t \u0111\u1ECBnh m\u1EE9c ${u-100}%! C\u1EA7n gi\u1EA3i tr\xECnh.</span>`)):u>80?(y.className="h-full rounded-full bg-amber-500 transition-all duration-300",p&&(p.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50",p.innerHTML="<span>G\u1EA7n ch\u1EA1m tr\u1EA7n</span>"),x&&(x.textContent=`\u0110\xE3 d\xF9ng ${u}% ng\xE2n s\xE1ch. G\u1EA7n ch\u1EA1m m\u1EE9c gi\u1EDBi h\u1EA1n.`)):(y.className="h-full rounded-full bg-indigo-500 transition-all duration-300",p&&(p.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",p.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>An to\xE0n</span>'),x&&(x.textContent=`Ng\xE2n s\xE1ch an to\xE0n (${u}%).`)))}async function ce(){let t=window,n=localStorage.getItem("orbit_user_site")||t.gCurrentUser&&t.gCurrentUser.assignedSite||"K001",e=((typeof getAppSitesList=="function"?getAppSitesList():[])||t.App&&t.App.siteObjs||[]).find(l=>(l.code||"").toLowerCase()===n.toLowerCase()),a=e?e.ten||e.name:document.getElementById("orderSite")?.value||n,i=document.getElementById("orderSite");if(i&&(i.innerHTML=`<option value="${a}">${a}</option>`,i.value=a),!a)return;let s=document.getElementById("globalMonthPicker")?.value,r=document.getElementById("orderMonth")?.value;if(!r||s&&r!==s){r=s||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;let l=document.getElementById("orderMonth");l&&(l.value=r)}let d="";if(r){let l=r.split("-");d=`${l[1]}/${l[0]}`}typeof showLoading=="function"&&showLoading("T\u1EA3i danh s\xE1ch v\u1EADt t\u01B0 theo Site...");try{let u=await(await fetch(`/api/quota?site=${encodeURIComponent(a)}&thang=${encodeURIComponent(d)}&refresh=true`)).json();if(u.success){_t(u.data.items||[]);let f=document.getElementById("kpiNganSach");f&&(f.dataset.raw=String(u.data.nganSach),f.textContent=T(u.data.nganSach),f.title=T(u.data.nganSach));let m=document.getElementById("kpiSubSite");m&&(m.textContent=u.data.site||a,m.title=u.data.site||a);let h=document.getElementById("kpiDaDat");h&&(h.dataset.raw=String(u.data.tienDaDat),h.textContent=T(u.data.tienDaDat),h.title=T(u.data.tienDaDat));let b=document.getElementById("budTotal");b&&(b.textContent=T(u.data.nganSach));let c=V(),y=Array.from(new Set(c.map(x=>x.tenLoai).filter(Boolean))),p=document.getElementById("fLoai");p&&(p.innerHTML='<option value="">T\u1EA5t c\u1EA3 lo\u1EA1i NVL</option>'+y.map(x=>`<option value="${x}">${x}</option>`).join("")),gt(),pt(u.data.nganSach,u.data.tienDaDat),t.lucide&&t.lucide.createIcons&&t.lucide.createIcons()}else typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i \u0111\u1ECBnh m\u1EE9c: "+(u.error||""))}catch(l){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+(l?.message||l))}finally{typeof hideLoading=="function"&&hideLoading()}}function Sn(){let n=V().filter(s=>(s.soLuongDat||0)>0);if(!n.length){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng cho \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng.");return}let o=document.getElementById("orderSite")?.value||"",e=document.getElementById("orderMonth")?.value||"",a=n.reduce((s,r)=>s+(r.soLuongDat||0)*(r.donGia||0),0),i=`
    <div class="space-y-3">
      <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
        <div>Site \u0111\u1EB7t: <b>${o}</b></div>
        <div>Th\xE1ng: <b>${e}</b></div>
        <div>T\u1ED5ng ti\u1EC1n \u0111\u01A1n: <b class="text-brand-700 tabular-nums text-sm">${T(a)}</b></div>
      </div>
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto max-h-56 rounded-xl border border-gray-200 dark:border-gray-800">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
          <tbody>
            ${n.map(s=>`
              <tr><td class="p-2 tabular-nums">${s.maHang}</td><td class="p-2">${s.tenSP}</td><td class="p-2 text-right tabular-nums font-bold">${s.soLuongDat}</td><td class="p-2 text-right tabular-nums">${T((s.soLuongDat||0)*s.donGia)}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <!-- Mobile Order Items Cards -->
      <div class="block sm:hidden space-y-2 max-h-56 overflow-y-auto">
        ${n.map(s=>`
          <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
            <div class="min-w-0">
              <div class="font-bold text-gray-900 dark:text-white truncate">${de(s.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${de(s.maHang)}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${s.soLuongDat}</div>
              <div class="num text-[11px] text-gray-500">${T((s.soLuongDat||0)*s.donGia)}</div>
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
  `;typeof openGeneralModal=="function"&&openGeneralModal("X\xE1c nh\u1EADn \u0111\u1EB7t h\xE0ng v\u1EADt t\u01B0",i)}async function En(){let t=window,n=V(),o=n.filter(r=>(r.soLuongDat||0)>0),e=document.getElementById("orderSite")?.value||"",a=document.getElementById("orderMonth")?.value||"",i=document.getElementById("orderNote"),s=i?i.value:"";typeof showLoading=="function"&&showLoading("L\u01B0u \u0111\u01A1n h\xE0ng v\xE0o Cloudflare D1...");try{let r={site:e,thang:a,nguoiDat:t.App&&t.App.user?t.App.user.email:"B\u1EBFp tr\u01B0\u1EDFng Site",ghiChu:s,items:o.map(u=>({maHang:u.maHang,tenSP:u.tenSP,dvt:u.dvt,donGia:u.donGia,soLuong:u.soLuongDat||0,daDat:u.daDat}))},l=await(await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();l.success?(typeof closeGeneralModal=="function"&&closeGeneralModal(),typeof showToast=="function"&&showToast(`\u0110\xE3 t\u1EA1o \u0111\u01A1n h\xE0ng th\xE0nh c\xF4ng! M\xE3: ${l.data.maDon}`),n.forEach(u=>{u.soLuongDat=0}),ce()):typeof showToast=="function"&&showToast("L\u1ED7i: "+l.error)}catch(r){typeof showToast=="function"&&showToast("L\u1ED7i: "+(r?.message||r))}finally{typeof hideLoading=="function"&&hideLoading()}}var q=window;q.loadQuota=ce;q.renderOrderTable=gt;q.filterItems=Ln;q.onQtyChange=Cn;q.calcBudget=pt;q.reviewOrder=Sn;q.submitOrder=En;q.getAppOrderItems=V;q.setAppOrderItems=_t;function ue(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function In(t){return typeof window.cellDate=="function"?window.cellDate(t):`<span class="tabular-nums text-xs text-gray-500">${U(t)}</span>`}function ge(t){return typeof window.cellPerson=="function"?window.cellPerson(t):`<span class="text-xs font-medium text-gray-700 dark:text-gray-300">${C(t||"\u2014")}</span>`}function pe(t,n){return typeof window.cellBadge=="function"?window.cellBadge(t,n):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${n}</span>`}function C(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function H(t){return typeof window.fmtVND=="function"?window.fmtVND(t):tt(Number(t)||0)}function st(t){return typeof window.fmtNum=="function"?window.fmtNum(t):et(Number(t)||0)}function U(t){return t?typeof window.fmtDate=="function"?window.fmtDate(t):Ce(t):"\u2014"}function G(t){let n=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let e=o.permissions["portal-history"],a=o.permissions["portal-order"];if(e&&e.canEdit!==void 0)return!!e.canEdit;if(a&&a.canEdit!==void 0)return!!a.canEdit}if(o.role==="BEP_TRUONG"){if(!t)return!0;let e=(t.trangThai||t.status||"").toUpperCase();return e.includes("M\u1EDAI")||e.includes("CH\u1EDC")||e.includes("PENDING")||e===""}return!1}function X(t){let n=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let e=o.permissions["portal-history"],a=o.permissions["portal-order"];if(e&&e.canDelete!==void 0)return!!e.canDelete;if(a&&a.canDelete!==void 0)return!!a.canDelete}if(o.role==="BEP_TRUONG"){if(!t)return!0;let e=(t.trangThai||t.status||"").toUpperCase();return e.includes("M\u1EDAI")||e.includes("CH\u1EDC")||e.includes("PENDING")||e===""}return!1}function Bt(t){let n=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let e=o.permissions["portal-history"],a=o.permissions["portal-order"];if(e&&(e.canAuthenticate!==void 0||e.canVerify!==void 0||e.canEdit!==void 0))return!!(e.canAuthenticate||e.canVerify||e.canEdit);if(a&&(a.canAuthenticate!==void 0||a.canVerify!==void 0||a.canEdit!==void 0))return!!(a.canAuthenticate||a.canVerify||a.canEdit)}return!1}function Ht(t,n,o){let e=Number(t)||1,i=n||{1:"Site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn",3:"Chuy\u1EC3n Tr\u01B0\u1EDFng Kho",4:"Mail cho PMH",5:"PMH \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"\u0110\xE3 giao v\u1EC1 site"}[e]||`B\u01B0\u1EDBc ${e}`,s="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",r="bg-blue-500";return e>=7?(s="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",r="bg-emerald-500"):e>=4?(s="bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",r="bg-indigo-500"):e>=2&&(s="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",r="bg-amber-500"),`
    <button type="button" onclick="openOrderJourneyModal('${o}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s} hover:shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer" title="B\u1EA5m \u0111\u1EC3 xem v\xE0 x\xE1c th\u1EF1c h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng">
      <span class="w-1.5 h-1.5 rounded-full ${r} animate-pulse shrink-0"></span>
      <span class="font-mono text-[11px] font-bold shrink-0">B${e}/7:</span>
      <span class="truncate max-w-[100px] text-left">${C(i)}</span>
    </button>
  `}function Nt(t){let n=document.getElementById("hsBody"),o=document.getElementById("hsMobileCards");if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}n&&(n.innerHTML=t.map(e=>{let a=G(e),i=X(e);return`
        <tr>
          <td class="col-code min-w-[130px]">${ue(e.maDon)}</td>
          <td class="col-date min-w-[110px]">${In(e.ngayDat)}</td>
          <td class="min-w-[260px] max-w-[360px]">
            <div class="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-normal leading-snug break-words">
              ${C(e.site||"\u2014")}
            </div>
          </td>
          <td class="min-w-[130px]">${ge(e.nguoiDat)}</td>
          <td class="col-num">${e.soDong}</td>
          <td class="col-num font-medium">${st(e.tongSL)}</td>
          <td class="col-num font-semibold text-brand-600 dark:text-brand-400">${H(e.tongTien)}</td>
          <td class="col-badge min-w-[140px] text-center">${pe("neutral",e.trangThai||"M\u1EDBi t\u1EA1o")}</td>
          <td class="text-center min-w-[170px]">
            ${Ht(e.currentStep,e.currentStepName,e.maDon)}
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
              ${a?`
                <button onclick="openEditOrderModal('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition" title="Ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>S\u1EEDa</span>
                </button>
              `:""}
              ${i?`
                <button onclick="confirmDeleteOrder('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition" title="X\xF3a \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a</span>
                </button>
              `:""}
            </div>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(e=>{let a=G(e),i=X(e);return`
        <div class="data-card space-y-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            ${ue(e.maDon)}
            ${pe("neutral",e.trangThai||"M\u1EDBi t\u1EA1o")}
          </div>
          <div class="font-bold text-sm text-gray-900 dark:text-white leading-snug break-words">
            ${C(e.site||"\u2014")}
          </div>
          <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Ti\u1EBFn \u0111\u1ED9:</span>
            </div>
            ${Ht(e.currentStep,e.currentStepName,e.maDon)}
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="num text-gray-900 dark:text-white whitespace-nowrap">${U(e.ngayDat)}</b></div>
            <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b>${ge(e.nguoiDat)}</b></div>
            <div>S\u1ED1 m\u1EB7t h\xE0ng: <b class="num text-gray-900 dark:text-white">${e.soDong} d\xF2ng</b></div>
            <div>T\u1ED5ng SL: <b class="num text-gray-900 dark:text-white">${st(e.tongSL)}</b></div>
            <div class="col-span-2 flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <span class="text-gray-500 font-medium">T\u1ED5ng gi\xE1 tr\u1ECB \u0111\u01A1n:</span>
              <span class="num font-semibold text-sm text-brand-600 dark:text-brand-400">${H(e.tongTien)}</span>
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
            ${a?`
              <button onclick="openEditOrderModal('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>S\u1EEDa</span>
              </button>
            `:""}
            ${i?`
              <button onclick="confirmDeleteOrder('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>X\xF3a</span>
              </button>
            `:""}
          </div>
        </div>
      `}).join(""))}function me(t){let n=window,o=n.App&&n.App.historyOrders?n.App.historyOrders:[];if(!t||t==="ALL"){Nt(o);return}let e=o.filter(a=>{let i=(a.trangThai||"").toUpperCase();return t==="APPROVED"?i.includes("DUY\u1EC6T")||i.includes("APPROVED"):t==="PENDING"?i.includes("CH\u1EDC")||i.includes("T\u1EA0O")||i.includes("PENDING"):t==="DELIVERED"?i.includes("NH\u1EACN")||i.includes("GIAO")||i.includes("DELIVERED"):t==="REJECTED"?i.includes("H\u1EE6Y")||i.includes("T\u1EEA CH\u1ED0I")||i.includes("REJECT"):!0});Nt(e)}async function Mn(){let t=window,n=document.getElementById("globalBranchSelect")?.value,o=t.gCurrentUser||(typeof t.loadPersistedUser=="function"?t.loadPersistedUser():null),e=o?o.assignedSite:"",a=localStorage.getItem("orbit_user_site"),i=document.getElementById("hsSite")?.value,s="";n?s=n==="ALL"?"":n:e?s=e==="ALL"?"":e:a?s=a==="ALL"?"":a:i&&(s=i==="ALL"?"":i);let r=document.getElementById("hsCurrentSiteBadge");if(r){if(s&&s!=="ALL"){let m=((typeof t.getAppSitesList=="function"?t.getAppSitesList():[])||[]).find(h=>h.code.toUpperCase()===s.toUpperCase()||h.name===s||h.ten&&h.ten===s);r.textContent=m?m.ten||m.name:s}else r.textContent="T\u1EA5t c\u1EA3 \u0111i\u1EC3m b\xE1n";r.classList.remove("hidden")}let d=document.getElementById("hsSite");d&&(d.value=s);let l=document.getElementById("hsMonth")?.value||"",u="";if(l){let f=l.split("-");u=`${f[1]}/${f[0]}`}try{typeof showLoading=="function"&&showLoading("T\u1EA3i l\u1ECBch s\u1EED \u0111\u01A1n h\xE0ng...");let f=`/api/orders?site=${encodeURIComponent(s)}&thang=${encodeURIComponent(u)}&_t=${Date.now()}`,h=await(await fetch(f,{cache:"no-store",headers:{"Cache-Control":"no-cache",Pragma:"no-cache"}})).json();t.App||(t.App={}),t.App.historyOrders=h.success&&h.data?h.data:[];let b=document.getElementById("hsOrderStatusFilter")?.value||"ALL";me(b)}catch(f){console.error("loadHistory error:",f)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}async function Tn(t){typeof showLoading=="function"&&showLoading("T\u1EA3i chi ti\u1EBFt \u0111\u01A1n...");try{let o=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}`)).json();if(o.success){let{info:e,items:a,timeline:i}=o.data,s=`
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
                ${(a||[]).map(r=>`<tr><td class="p-2 tabular-nums">${r.maHang}</td><td class="p-2">${r.tenSP}</td><td class="p-2">${r.dvt}</td><td class="p-2 text-right tabular-nums font-bold">${r.soLuong}</td><td class="p-2 text-right tabular-nums">${H(r.donGia)}</td><td class="p-2 text-right tabular-nums font-bold">${H(r.thanhTien)}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>

          <!-- Native Mobile Cards for Order Details -->
          <div class="block sm:hidden space-y-2 max-h-48 overflow-y-auto">
            ${(a||[]).map(r=>`
              <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
                <div class="min-w-0">
                  <div class="font-bold text-gray-900 dark:text-white truncate">${C(r.tenSP)}</div>
                  <div class="font-mono text-[11px] text-gray-400">${C(r.maHang)} \xB7 <span class="font-sans">${C(r.dvt||"")}</span></div>
                </div>
                <div class="text-right shrink-0">
                  <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${r.soLuong}</div>
                  <div class="num text-[11px] text-gray-500">${H(r.thanhTien)}</div>
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
              ${(i||[]).map(r=>`
                <div class="p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
                  <div class="flex justify-between font-bold text-gray-800 dark:text-gray-100">
                    <span>B\u01B0\u1EDBc ${r.buoc}: ${r.tenBuoc}</span>
                    <span class="tabular-nums text-gray-400 dark:text-gray-500 font-normal">${r.thoiGian?U(r.thoiGian):""}</span>
                  </div>
                  <div class="text-gray-500 dark:text-gray-400 mt-0.5">${r.nguoiXuLy||"H\u1EC7 th\u1ED1ng"} \xB7 Tr\u1EA1ng th\xE1i: <span class="font-bold text-brand-700 dark:text-brand-400">${r.trangThai}</span>${r.ghiChu?` \xB7 <span class="italic text-gray-600 dark:text-gray-300">"${C(r.ghiChu)}"</span>`:""}</div>
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
              ${G(e)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openEditOrderModal('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>Ch\u1EC9nh s\u1EEDa \u0111\u01A1n</span>
                </button>
              `:""}
              ${X(e)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); confirmDeleteOrder('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a \u0111\u01A1n h\xE0ng</span>
                </button>
              `:""}
            </div>
          </div>
        </div>
      `;typeof openGeneralModal=="function"&&openGeneralModal(`\u0110\u01A1n h\xE0ng ${t}`,s)}}catch(n){typeof showToast=="function"&&showToast("L\u1ED7i: "+(n?.message||n))}finally{typeof hideLoading=="function"&&hideLoading()}}var $n=null,_n=null,Ft=[{step:1,name:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",desc:"\u0110i\u1EC3m b\xE1n t\u1EA1o phi\u1EBFu \u0111\u1EB7t h\xE0ng th\xE0nh c\xF4ng qua h\u1EC7 th\u1ED1ng Portal"},{step:2,name:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",desc:"Admin/B\u1ED9 ph\u1EADn \u0111i\u1EC1u ph\u1ED1i ki\u1EC3m tra \u0111\u1ECBnh m\u1EE9c & duy\u1EC7t ti\u1EBFp nh\u1EADn \u0111\u01A1n"},{step:3,name:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",desc:"Th\u1EE7 kho ti\u1EBFp nh\u1EADn y\xEAu c\u1EA7u, ph\xE2n lo\u1EA1i v\xE0 chu\u1EA9n b\u1ECB k\u1EBF ho\u1EA1ch so\u1EA1n"},{step:4,name:"Kho mail cho PMH",desc:"Kho ph\u1ED1i h\u1EE3p ph\xF2ng mua h\xE0ng ho\u1EB7c nh\xE0 cung c\u1EA5p ki\u1EC3m tra t\u1ED3n kho"},{step:5,name:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",desc:"Ph\xF2ng mua h\xE0ng x\xE1c nh\u1EADn \u0111\u01A1n h\xE0ng v\u1EDBi NCC ho\u1EB7c xu\u1EA5t kho t\u1ED5ng"},{step:6,name:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",desc:"H\xE0ng h\xF3a t\u1EADp k\u1EBFt, ki\u1EC3m \u0111\u1EBFm ch\u1EA5t l\u01B0\u1EE3ng v\xE0 \u0111\xF3ng g\xF3i chuy\u1EC3n \u0111i"},{step:7,name:"Kho giao v\u1EC1 c\xE1c site",desc:"\u0110ang v\u1EADn chuy\u1EC3n giao v\u1EC1 \u0111i\u1EC3m b\xE1n / B\u1EBFp tr\u01B0\u1EDFng k\xFD nh\u1EADn \u0111\u1EE7"}];function Dt(t,n){let o=document.getElementById("journeyTimelineContainer");if(!o)return;let e=document.getElementById("journeyCurrentStepText"),a={};(n||[]).forEach(r=>{let d=Number(r.buoc);d&&(a[d]=r)});let i=Object.keys(a).map(Number),s=i.length?Math.max(...i):1;e&&(e.textContent=`B\u01B0\u1EDBc ${s}/7 (${Ft[s-1]?.name||""})`),o.innerHTML=Ft.map(r=>{let d=a[r.step],l=d&&(d.trangThai==="Ho\xE0n th\xE0nh"||d.trangThai==="Ho\xE0n t\u1EA5t"),u=r.step===s||d&&!l,f="bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700",m=`<span class="font-mono text-xs font-bold">${r.step}</span>`,h="border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/60",b="text-gray-500 dark:text-gray-400 font-medium",c='<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Ch\u1EDD x\u1EED l\xFD</span>';return l?(f="bg-emerald-600 text-white border-emerald-600 shadow-sm",m='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>',h="border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20",b="text-emerald-900 dark:text-emerald-200 font-bold",c='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>\u0110\xE3 ho\xE0n th\xE0nh</span>'):u&&(f="bg-indigo-600 text-white border-indigo-600 shadow-sm ring-4 ring-indigo-100 dark:ring-indigo-950/60",m='<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg>',h="border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-200 dark:ring-indigo-800/50",b="text-indigo-900 dark:text-indigo-100 font-bold",c='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>\u0110ang x\u1EED l\xFD</span>'),`
      <div class="relative flex items-start gap-3 group">
        <div class="absolute -left-[27px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${f}">
          ${m}
        </div>
        <div class="flex-1 p-3 rounded-xl border ${h} shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs ${b}">B\u01B0\u1EDBc ${r.step}: ${C(d?.tenBuoc||r.name)}</span>
            ${c}
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">${C(r.desc)}</p>
          ${d?`
            <div class="pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div class="text-gray-600 dark:text-gray-300">
                Ng\u01B0\u1EDDi x\u1EED l\xFD: <b class="text-gray-900 dark:text-white">${C(d.nguoiXuLy||"H\u1EC7 th\u1ED1ng")}</b>
              </div>
              <div class="text-gray-400 dark:text-gray-500 font-mono">
                ${d.thoiGian?U(d.thoiGian):""}
              </div>
              ${d.ghiChu?`
                <div class="w-full text-gray-700 dark:text-gray-300 italic bg-white/70 dark:bg-gray-800/60 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                  " ${C(d.ghiChu)} "
                </div>
              `:""}
            </div>
          `:""}
        </div>
      </div>
    `}).join("")}async function Bn(t){if(!t)return;$n=t,window._currentJourneyOrderCode=t;let n=document.getElementById("modalOrderJourney");if(!n)return;let o=document.getElementById("journeyOrderSubtitle");o&&(o.textContent=`M\xE3 \u0111\u01A1n: ${t}`),typeof showLoading=="function"&&showLoading("T\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng...");try{let a=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!a.success||!a.data){typeof showToast=="function"&&showToast(a.error||"Kh\xF4ng th\u1EC3 t\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng","error");return}let{info:i,timeline:s}=a.data;_n=a.data,window._currentJourneyData=a.data;let r=document.getElementById("journeySiteName");r&&(r.textContent=i.site_name||i.site||"\u2014");let d=document.getElementById("journeyOrderedBy");d&&(d.textContent=i.ordered_by||"\u2014");let l=document.getElementById("journeyOrderDate");l&&(l.textContent=U(i.order_date||""));let u=document.getElementById("journeyBadgeStatus");u&&(u.textContent=i.status||"\u0110ang x\u1EED l\xFD"),Dt(i,s||[]);let f=Bt(i),m=document.getElementById("journeyAdminSection");if(m)if(f){m.classList.remove("hidden");let h=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,b=document.getElementById("journeyAdminActor");b&&(b.textContent=h&&(h.fullName||h.email)||"Qu\u1EA3n tr\u1ECB vi\xEAn");let c=s&&s.length?Math.max(...s.map(v=>Number(v.buoc)||1)):1,y=Math.min(c+1,7),p=document.getElementById("journeySelectStep");p&&(p.value=String(y));let x=document.getElementById("journeyStepNote");x&&(x.value="")}else m.classList.add("hidden");n.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(e){console.error("Error openOrderJourneyModal:",e),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi t\u1EA3i h\xE0nh tr\xECnh","error")}finally{typeof hideLoading=="function"&&hideLoading()}}function Hn(){let t=document.getElementById("modalOrderJourney");t&&t.classList.add("hidden")}async function Nn(){let t=$n||window._currentJourneyOrderCode;if(!t)return;let n=document.getElementById("journeySelectStep"),o=document.getElementById("journeyStepStatus"),e=document.getElementById("journeyStepNote"),a=document.getElementById("btnSubmitJourneyStep"),i=Number(n?n.value:1),s=o?o.value:"Ho\xE0n th\xE0nh",r=e?e.value.trim():"",d=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,l=d&&(d.fullName||d.email)||"Admin",f={1:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",3:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",4:"Kho mail cho PMH",5:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"Kho giao v\u1EC1 c\xE1c site"}[i]||`B\u01B0\u1EDBc ${i}`;try{a&&(a.disabled=!0,a.innerHTML='<span class="inline-block animate-spin mr-1">\u23F3</span> \u0110ang l\u01B0u...');let h=await(await fetch("/api/order-journey",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,step:i,stepName:f,status:s,note:r,actor:l})})).json();if(!h.success){typeof showToast=="function"&&showToast(h.error||"C\u1EADp nh\u1EADt b\u01B0\u1EDBc h\xE0nh tr\xECnh th\u1EA5t b\u1EA1i","error");return}if(typeof showToast=="function"&&showToast(`\u0110\xE3 x\xE1c th\u1EF1c th\xE0nh c\xF4ng B\u01B0\u1EDBc ${i}: ${f}`,"success"),h.data&&h.data.timeline){let b=_n?.info||window._currentJourneyData?.info||{order_code:t};b.status=h.data.orderStatus;let c=document.getElementById("journeyBadgeStatus");c&&(c.textContent=b.status),Dt(b,h.data.timeline),n&&i<7&&(n.value=String(i+1)),e&&(e.value="")}typeof window.loadHistory=="function"&&window.loadHistory()}catch(m){console.error("Error submitJourneyStep:",m),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi c\u1EADp nh\u1EADt ti\u1EBFn \u0111\u1ED9","error")}finally{a&&(a.disabled=!1,a.innerHTML='<i data-lucide="check" class="w-3.5 h-3.5"></i><span>X\xE1c nh\u1EADn c\u1EADp nh\u1EADt b\u01B0\u1EDBc n\xE0y</span>',typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons())}}var _=[],fe=null;async function Fn(t){if(!G()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}typeof showLoading=="function"&&showLoading("\u0110ang t\u1EA3i th\xF4ng tin \u0111\u01A1n h\xE0ng...");try{let o=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n h\xE0ng");let{info:e,items:a}=o.data,i=document.getElementById("editOrderCode");i&&(i.value=e.order_code||t);let s=document.getElementById("editOrderSubtitle");s&&(s.textContent=`M\xE3 \u0111\u01A1n: ${e.order_code||t}`);let r=document.getElementById("editOrderSite");if(r){let c=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[])||[];r.innerHTML=c.map(y=>{let p=y.ten||y.name||y.code||y,x=e.site_name===p||e.site_name===y.name||e.site_name===y.code?"selected":"";return`<option value="${p}" ${x}>${p}</option>`}).join(""),e.site_name&&!c.some(y=>(y.ten||y.name||y.code)===e.site_name)&&r.insertAdjacentHTML("afterbegin",`<option value="${e.site_name}" selected>${e.site_name}</option>`)}let d=document.getElementById("editOrderDate");d&&(d.value=(e.order_date||"").slice(0,10));let l=document.getElementById("editOrderStatus");l&&(l.value=e.status||"M\u1EDBi t\u1EA1o");let u=document.getElementById("editOrderNguoiDat");u&&(u.value=e.ordered_by||"");let f=document.getElementById("editOrderThang");f&&(f.value=e.applied_month||"");let m=document.getElementById("editOrderGhiChu");m&&(m.value=""),_=(a||[]).map(c=>({maHang:c.maHang||c.item_code,tenSP:c.tenSP||c.item_name,dvt:c.dvt||c.unit||"Ph\u1EA7n",soLuong:Number(c.soLuong??c.order_qty??1),donGia:Number(c.donGia??c.unit_price??0),thanhTien:Number(c.thanhTien??(c.soLuong||1)*(c.donGia||0)),ghiChu:c.ghiChu||""})),window._editOrderItems=_;let h=document.getElementById("editOrderAddSelect");if(h){let c=window,y=c.App&&c.App.items&&c.App.items.length?c.App.items:[];if(!y.length)try{let x=await(await fetch(`/api/quota?site=${encodeURIComponent(e.site_name||"K001")}&thang=${encodeURIComponent(e.applied_month||"")}`)).json();x.success&&x.data?.items&&(y=x.data.items,c.App&&(c.App.items=y))}catch{}h.innerHTML='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng mu\u1ED1n th\xEAm --</option>'+y.map(p=>`
          <option value="${C(p.maHang||p.code)}" 
                  data-name="${C(p.tenHang||p.tenSP||p.name||"")}" 
                  data-unit="${C(p.dvt||p.unit||"Ph\u1EA7n")}" 
                  data-price="${Number(p.donGia||p.price||0)}">
            [${C(p.maHang||p.code)}] ${C(p.tenHang||p.tenSP||p.name||"")} (${H(p.donGia||p.price||0)}/${p.dvt||p.unit||""})
          </option>
        `).join("")}it();let b=document.getElementById("modalEditOrder");b&&b.classList.remove("hidden")}catch(n){console.error("openEditOrderModal error:",n),typeof showToast=="function"&&showToast("L\u1ED7i: "+(n?.message||n),"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}function he(){let t=document.getElementById("modalEditOrder");t&&t.classList.add("hidden"),_=[],window._editOrderItems=[]}function it(){let t=document.getElementById("editOrderItemsBody"),n=document.getElementById("editOrderItemsMobile"),o=_;t&&(o.length?t.innerHTML=o.map((e,a)=>`
        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
          <td class="p-2.5 text-center text-gray-400 font-mono">${a+1}</td>
          <td class="p-2.5 font-mono font-medium text-gray-900 dark:text-white">${C(e.maHang)}</td>
          <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">${C(e.tenSP)}</td>
          <td class="p-2.5 text-center text-gray-500">${C(e.dvt)}</td>
          <td class="p-2.5 text-right">
            <input type="number" min="0.1" step="0.5" value="${e.soLuong}" 
                   onchange="updateEditOrderItemQty(${a}, this.value)" 
                   class="w-20 px-2 py-1 text-right font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-500">
          </td>
          <td class="p-2.5 text-right font-mono text-gray-500">${H(e.donGia)}</td>
          <td class="p-2.5 text-right font-mono font-bold text-brand-600 dark:text-brand-400">${H(e.soLuong*e.donGia)}</td>
          <td class="p-2.5 text-center">
            <button type="button" onclick="removeEditOrderItemLine(${a})" class="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors" title="X\xF3a d\xF2ng">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </td>
        </tr>
      `).join(""):t.innerHTML='<tr><td colspan="8" class="p-4 text-center text-gray-400">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o. Vui l\xF2ng th\xEAm m\u1EB7t h\xE0ng b\xEAn d\u01B0\u1EDBi.</td></tr>'),n&&(o.length?n.innerHTML=o.map((e,a)=>`
        <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-bold text-gray-900 dark:text-white">${C(e.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${C(e.maHang)} \xB7 <span class="font-sans">${C(e.dvt)}</span></div>
            </div>
            <button type="button" onclick="removeEditOrderItemLine(${a})" class="p-1 text-rose-500 hover:text-rose-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-200 dark:border-gray-700/60">
            <div class="flex items-center gap-1.5">
              <span class="text-gray-500">S\u1ED1 l\u01B0\u1EE3ng:</span>
              <input type="number" min="0.1" step="0.5" value="${e.soLuong}" 
                     onchange="updateEditOrderItemQty(${a}, this.value)" 
                     class="w-16 px-1.5 py-0.5 text-center font-mono font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
            </div>
            <div class="text-right">
              <div class="font-mono font-bold text-brand-600 dark:text-brand-400">${H(e.soLuong*e.donGia)}</div>
            </div>
          </div>
        </div>
      `).join(""):n.innerHTML='<div class="p-4 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o</div>'),be()}function Dn(t,n){let o=Math.max(0,Number(n)||0);_&&_[t]&&(_[t].soLuong=o,_[t].thanhTien=o*(_[t].donGia||0),it())}function Rn(t){_&&_.length>t&&(_.splice(t,1),it())}function An(){let t=document.getElementById("editOrderAddSelect"),n=document.getElementById("editOrderAddQty");if(!t||!t.value){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t m\u1EB7t h\xE0ng \u0111\u1EC3 th\xEAm","warning");return}let o=t.value,e=t.selectedOptions[0],a=e.getAttribute("data-name")||o,i=e.getAttribute("data-unit")||"Ph\u1EA7n",s=Number(e.getAttribute("data-price"))||0,r=Math.max(.1,Number(n?n.value:1)||1),d=_.find(l=>l.maHang===o);d?(d.soLuong+=r,d.thanhTien=d.soLuong*d.donGia):_.push({maHang:o,tenSP:a,dvt:i,soLuong:r,donGia:s,thanhTien:r*s,ghiChu:""}),t.value="",n&&(n.value="1"),it()}function be(){let t=_,n=0,o=0;t.forEach(s=>{n+=Number(s.soLuong)||0,o+=(Number(s.soLuong)||0)*(Number(s.donGia)||0)});let e=document.getElementById("editOrderItemsCount");e&&(e.textContent=String(t.length));let a=document.getElementById("editOrderTotalQty");a&&(a.textContent=st(n));let i=document.getElementById("editOrderTotalAmount");i&&(i.textContent=H(o))}async function On(){if(!G()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}let t=document.getElementById("editOrderCode")?.value;if(!t){typeof showToast=="function"&&showToast("Thi\u1EBFu m\xE3 \u0111\u01A1n h\xE0ng","error");return}let n=document.getElementById("editOrderSite")?.value,o=document.getElementById("editOrderDate")?.value,e=document.getElementById("editOrderStatus")?.value,a=document.getElementById("editOrderNguoiDat")?.value,i=document.getElementById("editOrderThang")?.value,s=document.getElementById("editOrderGhiChu")?.value,r=_.filter(l=>(Number(l.soLuong)||0)>0);if(!r.length){typeof showToast=="function"&&showToast("\u0110\u01A1n h\xE0ng ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng c\xF3 s\u1ED1 l\u01B0\u1EE3ng > 0","warning");return}let d=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser;typeof showLoading=="function"&&showLoading("\u0110ang l\u01B0u c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng...");try{let u=await(await fetch("/api/order",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,site:n,orderDate:o,status:e,orderedBy:a,month:i,ghiChu:s,actor:d?d.full_name||d.fullName||d.email:"Ng\u01B0\u1EDDi qu\u1EA3n tr\u1ECB",items:r})})).json();if(!u.success)throw new Error(u.error||"C\u1EADp nh\u1EADt th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),he(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(l){console.error("saveEditOrder error:",l),typeof showToast=="function"&&showToast("L\u1ED7i l\u01B0u \u0111\u01A1n h\xE0ng: "+(l?.message||l),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}async function Pn(t){if(!X()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning");return}fe=t,window._pendingDeleteOrderCode=t;let n=document.getElementById("confirmDeleteOrderCode");n&&(n.textContent=t);let o=document.getElementById("confirmDeleteOrderInfo");o&&(o.innerHTML='<span class="text-gray-400">\u0110ang t\u1EA3i chi ti\u1EBFt \u0111\u01A1n...</span>');let e=document.getElementById("modalConfirmDeleteOrder");e&&e.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();try{let i=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(i.success&&i.data&&o){let{info:s,items:r}=i.data,d=(r||[]).reduce((u,f)=>u+(Number(f.thanhTien)||0),0),l=(r||[]).reduce((u,f)=>u+(Number(f.soLuong)||0),0);o.innerHTML=`
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div>\u0110i\u1EC3m b\xE1n: <b class="text-gray-900 dark:text-white truncate block">${C(s.site_name||"\u2014")}</b></div>
          <div>Ng\xE0y \u0111\u1EB7t: <b class="num font-medium text-gray-900 dark:text-white">${U(s.order_date)}</b></div>
          <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b class="text-gray-900 dark:text-white truncate block">${C(s.ordered_by||"\u2014")}</b></div>
          <div>Tr\u1EA1ng th\xE1i: <b class="text-brand-600 dark:text-brand-400">${C(s.status||"M\u1EDBi t\u1EA1o")}</b></div>
          <div class="col-span-2 pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span>M\u1EB7t h\xE0ng: <b>${r.length} m\xF3n (${st(l)} SL)</b></span>
            <span class="font-bold text-sm text-brand-600 dark:text-brand-400">${H(d)}</span>
          </div>
        </div>
      `}}catch{}}function Rt(){let t=document.getElementById("modalConfirmDeleteOrder");t&&t.classList.add("hidden"),fe=null,window._pendingDeleteOrderCode=null}async function jn(){let t=fe||window._pendingDeleteOrderCode;if(t){if(!X()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning"),Rt();return}typeof showLoading=="function"&&showLoading("\u0110ang x\xF3a \u0111\u01A1n h\xE0ng kh\u1ECFi CSDL...");try{let o=await(await fetch(`/api/order?orderCode=${encodeURIComponent(t)}`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t})})).json();if(!o.success)throw new Error(o.error||"X\xF3a th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 x\xF3a v\u0129nh vi\u1EC5n \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),Rt(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(n){console.error("executeDeleteOrder error:",n),typeof showToast=="function"&&showToast("L\u1ED7i x\xF3a \u0111\u01A1n: "+(n?.message||n),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}}var E=window;E.renderJourneyBadge=Ht;E.renderHsOrdersList=Nt;E.filterHsOrders=me;E.loadHistory=Mn;E.viewOrderDetail=Tn;E.canEditOrders=G;E.canDeleteOrders=X;E.canAuthenticateJourney=Bt;E.STANDARD_STEPS=Ft;E.renderJourneyTimeline=Dt;E.openOrderJourneyModal=Bn;E.closeOrderJourneyModal=Hn;E.submitJourneyStep=Nn;E.openEditOrderModal=Fn;E.closeEditOrderModal=he;E.renderEditOrderItems=it;E.updateEditOrderItemQty=Dn;E.removeEditOrderItemLine=Rn;E.addEditOrderItemLine=An;E.recalcEditOrderTotals=be;E.saveEditOrder=On;E.confirmDeleteOrder=Pn;E.closeDeleteOrderModal=Rt;E.executeDeleteOrder=jn;function ye(t){return t==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse":t==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800":"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"}function Wn(t){return t==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800":t==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800":"bg-gray-50 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300 border-gray-200/70 dark:border-gray-700/60"}function Vn(t,n){return t<=0?n<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`${t} ng\xE0y`}function qn(t,n){return t<=0?n<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`C\xF2n ${t} ng\xE0y`}function xe(t){return t==="red"?"text-rose-600 dark:text-rose-400":t==="yellow"?"text-amber-600 dark:text-amber-400":"text-emerald-600 dark:text-emerald-400"}function Un(t){return t==="red"?"text-rose-600 dark:text-rose-400":t==="yellow"?"text-amber-600 dark:text-amber-400":"text-gray-900 dark:text-white"}function mt(t){return t.batch_code||t.batch_no||t.site_code||"KHO"}function ft(t){return t.unit||t.uom||"Ph\u1EA7n"}function dt(t){return typeof t=="number"?t:parseFloat(t||"0")||0}function we(t){let n=dt(t);return et(n,2)}var F=1,At=10,Ot="fefo_priority",ht="asc",B=new Set;function Gn(){return B}function Xn(){return F}function Qn(t){F=t}function ve(t){let n=document.getElementById("fefoTableBody"),o=document.getElementById("fefoMobileCards");if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}n&&(n.innerHTML=t.map(e=>{let a=ye(e.danger_level),i=Wn(e.danger_level),s=B.has(e.sku),r=mt(e),d=ft(e),l=e.exp_date?e.exp_date.slice(0,10):"\u2014",u=dt(e.qty),f=e.days_remaining!==void 0?e.days_remaining:e.days_left!==void 0?e.days_left:45,m=Vn(f,u),h=xe(e.danger_level),b=(e.item_name||"").replace(/'/g,"\\'"),c=e.fefo_priority??1;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3.5 text-center whitespace-nowrap">
            <input type="checkbox" class="stock-row-checkbox rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer" data-sku="${e.sku}" onchange="toggleStockItemSelect('${e.sku}', this.checked)" ${s?"checked":""}>
          </td>
          <td class="p-3.5 text-center whitespace-nowrap">
            <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs mx-auto">${c}</span>
          </td>
          <td class="p-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${e.sku}')" class="text-brand-500 dark:text-brand-400 hover:underline" title="Xem chi ti\u1EBFt k\u1EF9 thu\u1EADt">
              ${e.sku}
            </a>
          </td>
          <td class="p-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[180px]">${e.item_name}</td>
          <td class="p-3.5 whitespace-nowrap">
            <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60">${r}</span>
          </td>
          <td class="p-3.5 whitespace-nowrap min-w-[130px]">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border ${i}">
              <i data-lucide="calendar" class="w-3.5 h-3.5 shrink-0 opacity-70"></i>
              <span>${l}</span>
            </div>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap min-w-[110px]">
            ${we(u)} <span class="font-sans text-xs font-normal text-gray-500">${d}</span>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold whitespace-nowrap min-w-[95px] ${h}">${m}</td>
          <td class="p-3.5 text-center whitespace-nowrap min-w-[110px]">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${a}">${e.status_text||"An to\xE0n"}</span>
          </td>
          <td class="p-3.5 text-right whitespace-nowrap min-w-[120px]">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${e.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi ti\u1EBFt k\u1EF9 thu\u1EADt">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openEditItemModal('${e.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Ch\u1EC9nh s\u1EEDa \u0111\u1ECBnh m\u1EE9c an to\xE0n">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="openIssueModal('${e.sku}', '${b}', '${r}', ${u})" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all">
                <i data-lucide="package-minus" class="w-3.5 h-3.5"></i> Xu\u1EA5t B\u1EBFp
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(e=>{let a=ye(e.danger_level),i=mt(e),s=ft(e),r=e.exp_date?e.exp_date.slice(0,10):"\u2014",d=dt(e.qty),l=e.days_remaining!==void 0?e.days_remaining:e.days_left!==void 0?e.days_left:45,u=qn(l,d),f=Un(e.danger_level),m=xe(e.danger_level),h=(e.item_name||"").replace(/'/g,"\\'");return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">P${e.fefo_priority??1}</span>
              <span class="font-bold text-xs text-gray-900 dark:text-white truncate">${e.item_name}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 whitespace-nowrap ${a}">${e.status_text||u}</span>
          </div>
          <div class="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-xs">
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">M\xE3 SKU</div>
              <div class="font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap truncate">${e.sku}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">M\xE3 L\xF4 / \u0110i\u1EC3m B\xE1n</div>
              <div class="font-mono font-semibold text-gray-900 dark:text-white whitespace-nowrap truncate">${i}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">H\u1EA1n D\xF9ng (EXP)</div>
              <div class="inline-flex items-center gap-1 font-mono font-bold text-xs whitespace-nowrap ${f}">
                <i data-lucide="calendar" class="w-3 h-3 shrink-0 opacity-70"></i>
                <span>${r}</span>
              </div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">T\xECnh Tr\u1EA1ng H\u1EA1n</div>
              <div class="font-mono font-bold text-xs whitespace-nowrap ${m}">${u}</div>
            </div>
            <div class="col-span-2 flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-gray-800">
              <span class="text-xs text-gray-500 font-medium">T\u1ED3n kh\u1EA3 d\u1EE5ng:</span>
              <span class="font-mono font-bold text-sm whitespace-nowrap ${d<0?"text-rose-600":"text-brand-500 dark:text-brand-400"}">${we(d)} <span class="font-sans text-xs font-normal text-gray-500">${s}</span></span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1">
            <button onclick="openItemDetailModal('${e.sku}')" class="px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">Chi ti\u1EBFt</button>
            <button onclick="openIssueModal('${e.sku}', '${h}', '${i}', ${d})" class="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"><i data-lucide="package-minus" class="w-3 h-3"></i> Xu\u1EA5t B\u1EBFp</button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function J(){let t=(document.getElementById("fefoSearchInput")?.value||"").toLowerCase().trim(),n=document.getElementById("fefoCategoryFilter")?.value||"",o=document.getElementById("fefoStatusFilter")?.value||"",a=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(b=>{let c=!t||b.sku&&b.sku.toLowerCase().includes(t)||b.item_name&&b.item_name.toLowerCase().includes(t)||b.batch_code&&b.batch_code.toLowerCase().includes(t)||b.batch_no&&b.batch_no.toLowerCase().includes(t),y=!n||b.category===n||!!b.category&&b.category.includes(n),p=!0;return o==="safe"?p=b.danger_level==="green":o==="yellow"?p=b.danger_level==="yellow":o==="red"?p=b.danger_level==="red":o&&(p=b.danger_level===o),c&&y&&p});a.sort((b,c)=>{let y=b[Ot]??"",p=c[Ot]??"";return typeof y=="number"&&typeof p=="number"?ht==="asc"?y-p:p-y:ht==="asc"?String(y).localeCompare(String(p)):String(p).localeCompare(String(y))});let i=a.length,s=Math.ceil(i/At)||1;F>s&&(F=s),F<1&&(F=1);let r=(F-1)*At,d=a.slice(r,r+At),l=document.getElementById("stockPageEnd");l&&(l.textContent=String(Math.min(r+At,i)));let u=document.getElementById("stockTotalCount");u&&(u.textContent=String(i));let f=document.getElementById("stockCurrentPageBadge");f&&(f.textContent=`${F}/${s}`);let m=document.getElementById("stockPrevBtn");m&&(m.disabled=F<=1);let h=document.getElementById("stockNextBtn");h&&(h.disabled=F>=s),ve(d)}function Kn(t){F+=t,J()}function Jn(t){Ot===t?ht=ht==="asc"?"desc":"asc":(Ot=t,ht="asc"),J()}function zn(){let t=document.getElementById("fefoSearchInput");t&&(t.value="");let n=document.getElementById("fefoCategoryFilter");n&&(n.value="");let o=document.getElementById("fefoStatusFilter");o&&(o.value=""),F=1,J()}function Yn(t){document.querySelectorAll(".stock-row-checkbox").forEach(o=>{o.checked=t;let e=o.dataset.sku;e&&(t?B.add(e):B.delete(e))}),bt()}function Zn(t,n){n?B.add(t):B.delete(t),bt()}function bt(){let t=document.getElementById("stockBulkActionBar"),n=document.getElementById("selectedStockCount");t&&(B.size>0?(t.classList.remove("hidden"),n&&(n.textContent=String(B.size))):t.classList.add("hidden"))}function to(){B.clear();let t=document.getElementById("selectAllStockCheckbox");t&&(t.checked=!1),document.querySelectorAll(".stock-row-checkbox").forEach(n=>{n.checked=!1}),bt()}var Pt=null;async function jt(){try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",o=await(await fetch(`/api/stock?branch=${encodeURIComponent(t)}`)).json();if(o.success){typeof App<"u"&&(App.fefoItems=o.data||[]);let e=document.getElementById("fefoCategoryFilter"),a=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(e&&a.length){let i=e.value,s=Array.from(new Set(a.map(r=>r.category).filter(Boolean))).sort();e.innerHTML='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>'+s.map(r=>`<option value="${r}">${r}</option>`).join(""),i&&s.includes(i)&&(e.value=i)}J()}}catch(t){console.error("Error loading FEFO stock:",t)}}function eo(){let t=document.getElementById("modalFastReceipt");t&&t.classList.remove("hidden")}function no(t,n,o,e){let a=document.getElementById("issueSku");a&&(a.value=t);let i=document.getElementById("issueBatchLabel");i&&(i.innerHTML=`<b>${t}</b> - ${n} <br>L\xF4: <b>${o}</b> (Kh\u1EA3 d\u1EE5ng: ${e})`);let s=document.getElementById("modalFastIssue");s&&s.classList.remove("hidden")}function yt(t){let n=document.getElementById(t);n&&n.classList.add("hidden")}async function oo(){typeof showLoading=="function"&&showLoading("\u0110ang ghi nh\u1EADn nh\u1EADp kho...");try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",n=document.getElementById("recSku"),o=document.getElementById("recBatch"),e=document.getElementById("recMfg"),a=document.getElementById("recExp"),i=document.getElementById("recQty"),s=document.getElementById("recLoc"),r={branch_code:t,sku:n?n.value:"",batch_code:o&&o.value?o.value:"BAT-"+Date.now().toString().slice(-4),mfg_date:e?e.value:"",exp_date:a?a.value:"",qty:i?i.value:"0",storage_loc:s?s.value:""},l=await(await fetch("/api/stock/receipt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();l.success?(yt("modalFastReceipt"),typeof showToast=="function"&&showToast("Nh\u1EADp kho l\xF4 m\u1EDBi th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),jt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+l.error)}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}async function ao(){typeof showLoading=="function"&&showLoading("\u0110ang th\u1EF1c hi\u1EC7n xu\u1EA5t kho FEFO...");try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",n=document.getElementById("issueSku"),o=document.getElementById("issueQty"),e=document.getElementById("issueNote"),a={branch_code:t,sku:n?n.value:"",qty_needed:o?o.value:"0",note:e?e.value:""},s=await(await fetch("/api/stock/issue",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).json();s.success?(yt("modalFastIssue"),typeof showToast=="function"&&showToast("Xu\u1EA5t kho chu\u1EA9n FEFO th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),jt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+s.error)}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}function ro(t){let o=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(d=>d.sku===t);if(!o)return;let e=document.getElementById("editItemSku"),a=document.getElementById("editItemName"),i=document.getElementById("editItemSafetyStock"),s=document.getElementById("editItemUnit");e&&(e.value=o.sku),a&&(a.value=`${o.sku} - ${o.item_name}`),i&&(i.value=String(o.safety_stock||5)),s&&(s.value=o.unit||o.uom||"Can 5L");let r=document.getElementById("modalEditItem");r&&r.classList.remove("hidden")}function so(){let t=document.getElementById("editItemSku"),n=document.getElementById("editItemSafetyStock"),o=document.getElementById("editItemUnit"),e=t?t.value:"",a=n&&parseFloat(n.value)||5,i=o?o.value:"",r=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(d=>d.sku===e);r&&(r.safety_stock=a,r.unit=i),yt("modalEditItem"),typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u1ECBnh m\u1EE9c an to\xE0n cho ${e}!`),J()}async function io(t){try{let n=document.getElementById("modalInventoryDetail");if(!n)return;n.classList.remove("hidden");let o=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",a=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(c=>c.sku===t);if(!a){let y=await(await fetch(`/api/stock?branch=${encodeURIComponent(o)}`)).json();y.success&&y.data&&(a=y.data.find(p=>p.sku===t))}a||(a={sku:t,item_name:t,category:"Gia v\u1ECB",unit:"\u0110\u01A1n v\u1ECB",qty:12,safety_stock:5,standard_cost_sap:185e3,lead_time_hours:24});let i=document.getElementById("detailItemSku");i&&(i.textContent=a.sku);let s=document.getElementById("detailItemName");s&&(s.textContent=a.item_name||a.sku);let r=document.getElementById("detailItemUnit");r&&(r.textContent=a.unit||a.uom||"\u0110\u01A1n v\u1ECB");let d=document.getElementById("detailBadgeCategory");d&&(d.textContent=(a.sku.slice(0,2)||"GV").toUpperCase());let l=document.getElementById("detailQty");l&&(l.textContent=`${a.qty||0} ${a.unit||a.uom||""}`);let u=document.getElementById("detailSafetyStock");u&&(u.textContent=`${a.safety_stock||5} ${a.unit||a.uom||""}`);let f=document.getElementById("detailStandardCost");f&&(f.textContent=tt(Number(a.standard_cost_sap)||185e3));let m=document.getElementById("detailLeadTime");m&&(m.textContent=`${a.lead_time_hours||24}h`);let h=document.getElementById("itemDetailStockChart");if(h&&typeof ApexCharts<"u"){Pt&&Pt.destroy();let c=typeof isDarkModeActive=="function"?isDarkModeActive():!1,p={series:[{name:"T\u1ED3n kho th\u1EF1c t\u1EBF",data:[15,14,16,12,11,14,13,15,14,12,typeof a.qty=="number"?a.qty:parseFloat(String(a.qty))||10]}],colors:["#19723C"],chart:{fontFamily:"'Be Vietnam Pro', sans-serif",type:"area",height:180,toolbar:{show:!1},sparkline:{enabled:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:2.5},fill:{type:"gradient",gradient:{shadeIntensity:1,opacityFrom:.35,opacityTo:.05,stops:[0,95,100]}},xaxis:{categories:["09/11","10/11","11/11","12/11","13/11","14/11","15/11","16/11","17/11","18/11","19/11"],labels:{style:{colors:c?"#94A3B8":"#64748B",fontSize:"10px"}}},yaxis:{labels:{style:{colors:c?"#94A3B8":"#64748B",fontSize:"10px"}}},grid:{borderColor:c?"#1E293B":"#F1F5F9",strokeDashArray:3}};Pt=new ApexCharts(h,p),Pt.render()}let b=document.getElementById("detailTransactionsBody");b&&(b.innerHTML=`
        <tr>
          <td colspan="5" class="py-6 text-center text-gray-400 dark:text-gray-500 text-xs">
            Ch\u01B0a c\xF3 ph\xE1t sinh giao d\u1ECBch cho m\u1EB7t h\xE0ng n\xE0y.
          </td>
        </tr>
      `),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(n){console.error("Error opening item detail:",n)}}function lo(t,n,o){let a=[["\u01AFu Ti\xEAn FEFO","M\xE3 SKU","T\xEAn M\u1EB7t H\xE0ng","M\xE3 L\xF4","H\u1EA1n D\xF9ng (EXP)","S\u1ED1 L\u01B0\u1EE3ng T\u1ED3n","\u0110\u01A1n V\u1ECB","S\u1ED1 Ng\xE0y C\xF2n","Tr\u1EA1ng Th\xE1i"]];o.forEach(d=>{let l=d.fefo_priority??1,u=d.sku||"",f=d.item_name||"",m=mt(d),h=d.exp_date?d.exp_date.slice(0,10):"\u2014",b=dt(d.qty),c=ft(d),y=d.days_remaining!==void 0?d.days_remaining:d.days_left!==void 0?d.days_left:45,p=d.status_text||"An to\xE0n";a.push([l,u,f,m,h,b,c,y,p])});let i=XLSX.utils.book_new(),s=XLSX.utils.aoa_to_sheet(a),r=XLSX.utils.decode_range(s["!ref"]);s["!cols"]=[{wch:14},{wch:14},{wch:34},{wch:16},{wch:16},{wch:14},{wch:10},{wch:14},{wch:16}];for(let d=r.s.r;d<=r.e.r;++d)for(let l=r.s.c;l<=r.e.c;++l){let u=XLSX.utils.encode_cell({r:d,c:l});if(s[u])if(d===0)s[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let f="left",m;l===0||l===1||l===3||l===4||l===6||l===8?f="center":(l===5||l===7)&&(f="right",l===5&&(m="#,##0.00"),l===7&&(m="#,##0"));let h=l===5&&typeof s[u].v=="number"&&s[u].v<0;s[u].s={font:{name:"Aptos",sz:11,bold:!1,color:{rgb:h?"C00000":"000000"}},alignment:{horizontal:f,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},m&&(s[u].z=m)}}s["!freeze"]={xSplit:0,ySplit:1},s["!autofilter"]={ref:s["!ref"]},XLSX.utils.book_append_sheet(i,s,n),XLSX.writeFile(i,t)}function co(){let t=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(!t||!t.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}lo("Danh_Sach_Ton_Kho_FEFO.xlsx","TonKhoFEFO",t)}function uo(){if(B.size===0){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t Excel!");return}let n=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(o=>B.has(o.sku));lo("Ton_Kho_Duoc_Chon.xlsx","DuocChon",n)}if(typeof window<"u"){let t=window;t.renderFefoRows=ve,t.filterFefoLive=J,t.changeStockPage=Kn,t.sortStockBy=Jn,t.resetFefoFilters=zn,t.toggleSelectAllStock=Yn,t.toggleStockItemSelect=Zn,t.updateStockBulkBar=bt,t.clearStockSelection=to,t.selectedStockSkus=B,t.getSelectedStockSkus=Gn,t.getStockCurrentPage=Xn,t.setStockCurrentPage=Qn,t.loadStockFEFO=jt,t.openReceiptModal=eo,t.openIssueModal=no,t.closeModal=yt,t.submitReceiptToBackend=oo,t.submitIssueToBackend=ao,t.openEditItemModal=ro,t.saveItemSpecs=so,t.openItemDetailModal=io,t.exportFefoToExcel=co,t.exportSelectedStockExcel=uo}console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{Ft as STANDARD_STEPS,An as addEditOrderItemLine,Oe as addManualReceiptItem,Et as addWasteLineRow,Co as api,pt as calcBudget,Bt as canAuthenticateJourney,X as canDeleteOrders,G as canEditOrders,Kn as changeStockPage,to as clearStockSelection,zt as closeConfirmClearManualLinesModal,Xt as closeCreateReceiptModal,ee as closeCreateWasteModal,Rt as closeDeleteOrderModal,he as closeEditOrderModal,yn as closeInvDetailModal,Qt as closeManualReceiptModal,yt as closeModal,Hn as closeOrderJourneyModal,Jt as confirmClearAllManualReceiptLines,Pn as confirmDeleteOrder,_n as currentJourneyData,$n as currentJourneyOrderCode,ko as debounce,_ as editOrderItems,g as escapeHtml,Ge as executeClearAllManualReceiptLines,jn as executeDeleteOrder,xn as exportCountSheetExcel,co as exportFefoToExcel,Tt as exportFnbStockExcel,uo as exportSelectedStockExcel,J as filterFefoLive,me as filterHsOrders,Ln as filterItems,Y as filterManualCatalogList,mt as formatBatchCode,Vt as formatCompactVND,Ce as formatDate,vo as formatDateYMD,we as formatItemQty,et as formatNumber,Q as formatReceiptDateYMD,ft as formatUnit,tt as formatVND,P as gFnbStockData,$ as gFnbStockFilter,$t as gFnbStockSearchTerm,W as getActiveFnbCountSite,R as getActiveFnbReceiptSite,A as getActiveFnbWasteSite,V as getAppItems,ye as getDangerBadgeClass,qn as getDaysRemainingMobileText,Vn as getDaysRemainingText,xe as getDaysTextColor,Wn as getExpBadgeClass,Un as getExpDateColor,N as getReceiptExpWarningHtml,Gn as getSelectedStockSkus,Xn as getStockCurrentPage,Wa as handleExportFnbStockExcel,mo as loadFnbCounts,ae as loadFnbCountsHistory,K as loadFnbPoList,Se as loadFnbReceipts,Ne as loadFnbReceiptsHistory,re as loadFnbStock,po as loadFnbWaste,Zt as loadFnbWasteHistory,Mn as loadHistory,ct as loadManualCatalogItems,ce as loadQuota,jt as loadStockFEFO,St as loadWasteModalItems,mn as onCountInputChange,fn as onCountNoteChange,un as onFnbCountDateChange,ln as onFnbCountFilterChange,dn as onFnbCountNganhHangChange,cn as onFnbCountSearch,gn as onFnbCountSiteChange,Ee as onFnbPoSearchInput,wn as onFnbStockFilterChange,vn as onFnbStockSearch,kn as onFnbStockToggleValue,Je as onFnbWasteFilterChange,Ke as onFnbWasteNganhHangChange,ze as onFnbWasteSearch,Ye as onFnbWasteSiteChange,We as onManualLineBatchChange,Ve as onManualLineExpChange,Ue as onManualLineLocChange,je as onManualLinePriceChange,Pe as onManualLineQtyChange,Re as onManualReceiptSiteChange,Cn as onQtyChange,Me as onReceiptLineBatchChange,Te as onReceiptLineExpChange,_e as onReceiptLineNoteChange,Ie as onReceiptLineQtyChange,en as onWasteLineNoteChange,Ze as onWasteLineQtyChange,tn as onWasteLineReasonChange,rn as onWasteModalItemSelect,ne as onWasteModalLineQtyInput,an as onWasteModalSiteChange,Be as openCreateReceiptModal,on as openCreateWasteModal,ro as openEditItemModal,Fn as openEditOrderModal,no as openIssueModal,io as openItemDetailModal,De as openManualReceiptModal,Bn as openOrderJourneyModal,Ut as openPoReceiptModal,eo as openReceiptModal,dt as parseQty,fe as pendingDeleteOrderCode,It as populateFnbCountFilters,Mt as populateFnbCountNhomHangDropdown,te as populateFnbWasteFilters,Lt as populateFnbWasteNhomHangDropdown,Yt as populateFnbWasteSiteDropdown,be as recalcEditOrderTotals,oe as recalculateWasteModalTotal,Rn as removeEditOrderItemLine,Kt as removeManualReceiptLine,it as renderEditOrderItems,ve as renderFefoRows,O as renderFnbCountsTable,vt as renderFnbPoTable,ut as renderFnbStock,rt as renderFnbWasteStockTable,Nt as renderHsOrdersList,Ht as renderJourneyBadge,Dt as renderJourneyTimeline,ot as renderManualReceiptLinesTable,gt as renderOrderTable,Gt as renderReceiptLinesTable,zn as resetFefoFilters,Sn as reviewOrder,On as saveEditOrder,hn as saveFnbCountAudit,so as saveItemSpecs,B as selectedStockSkus,_t as setAppItems,qe as setManualLineQuickExp,$e as setReceiptLineQuickExp,Qn as setStockCurrentPage,Jn as sortStockBy,He as submitCreateReceipt,sn as submitCreateWaste,nn as submitDirectWaste,ao as submitIssueToBackend,Nn as submitJourneyStep,Xe as submitManualReceipt,En as submitOrder,oo as submitReceiptToBackend,nt as switchFnbReceiptSubView,at as switchFnbWasteSubView,pn as toggleBlindCount,Ae as toggleManualShowAllCatalog,Yn as toggleSelectAllStock,Zn as toggleStockItemSelect,Dn as updateEditOrderItemQty,kt as updateManualTotals,bt as updateStockBulkBar,Ct as updateWasteKPIs,bn as viewCountDetail,Tn as viewOrderDetail,Fe as viewReceiptDetail,Qe as viewWasteDetail};
