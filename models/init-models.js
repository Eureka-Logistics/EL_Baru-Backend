var DataTypes = require("sequelize").DataTypes;
var _act_acount = require("./act_acount");
var _act_dept = require("./act_dept");
var _act_gl = require("./act_gl");
var _act_gl_detail = require("./act_gl_detail");
var _act_juornal_detail = require("./act_juornal_detail");
var _act_pajak = require("./act_pajak");
var _act_pajak_pembatalan = require("./act_pajak_pembatalan");
var _act_sop = require("./act_sop");
var _act_sop_lampiran = require("./act_sop_lampiran");
var _alamat = require("./alamat");
var _alamat_fee = require("./alamat_fee");
var _alamat_fee_history = require("./alamat_fee_history");
var _alamat_po = require("./alamat_po");
var _alamat_ritase = require("./alamat_ritase");
var _armada = require("./armada");
var _armadaa = require("./armadaa");
var _awb = require("./awb");
var _bbm_price = require("./bbm_price");
var _berita = require("./berita");
var _blog_article = require("./blog_article");
var _blog_image = require("./blog_image");
var _blog_partial = require("./blog_partial");
var _blog_partial_sub = require("./blog_partial_sub");
var _blog_settings = require("./blog_settings");
var _cabang = require("./cabang");
var _chat = require("./chat");
var _chat_driver = require("./chat_driver");
var _ci_sessions = require("./ci_sessions");
var _collector_purchase_invoices = require("./collector_purchase_invoices");
var _collector_purchase_payments = require("./collector_purchase_payments");
var _collector_purchase_payments_records = require("./collector_purchase_payments_records");
var _collector_receive_payment = require("./collector_receive_payment");
var _collector_receive_payment_record = require("./collector_receive_payment_record");
var _collector_sales_invoices = require("./collector_sales_invoices");
var _command_center_fcm_tokens = require("./command_center_fcm_tokens");
var _config = require("./config");
var _customer = require("./customer");
var _customer_info = require("./customer_info");
var _customer_npwp = require("./customer_npwp");
var _customer_price = require("./customer_price");
var _customer_policy = require("./customer_policy");
var _gps_geofence = require("./gps_geofence");
var _m_sm_retur_history = require("./m_sm_retur_history");
var _d_customer = require("./d_customer");
var _dev_emc_address = require("./dev_emc_address");
var _dev_emc_order = require("./dev_emc_order");
var _dev_emc_order_detail = require("./dev_emc_order_detail");
var _ebh_area = require("./ebh_area");
var _ebh_category_sub = require("./ebh_category_sub");
var _ebh_category_utama = require("./ebh_category_utama");
var _ebh_product = require("./ebh_product");
var _ebh_product_stock = require("./ebh_product_stock");
var _emc_address = require("./emc_address");
var _emc_chat = require("./emc_chat");
var _emc_city = require("./emc_city");
var _emc_config = require("./emc_config");
var _emc_cus = require("./emc_cus");
var _emc_customer = require("./emc_customer");
var _emc_customer_chat = require("./emc_customer_chat");
var _emc_customer_company = require("./emc_customer_company");
var _emc_customer_log = require("./emc_customer_log");
var _emc_customer_referral = require("./emc_customer_referral");
var _emc_customer_voucher = require("./emc_customer_voucher");
var _emc_driver = require("./emc_driver");
var _emc_driver_chat = require("./emc_driver_chat");
var _emc_driver_chat_customer = require("./emc_driver_chat_customer");
var _emc_driver_claim_point = require("./emc_driver_claim_point");
var _emc_driver_emergency = require("./emc_driver_emergency");
var _emc_driver_income = require("./emc_driver_income");
var _emc_driver_locations = require("./emc_driver_locations");
var _emc_driver_order = require("./emc_driver_order");
var _emc_fees = require("./emc_fees");
var _emc_history_deposit = require("./emc_history_deposit");
var _emc_history_payment = require("./emc_history_payment");
var _emc_jne_awb = require("./emc_jne_awb");
var _emc_jne_city = require("./emc_jne_city");
var _emc_jne_kode = require("./emc_jne_kode");
var _emc_jne_province = require("./emc_jne_province");
var _emc_jne_subdistrict = require("./emc_jne_subdistrict");
var _emc_jne_tarif = require("./emc_jne_tarif");
var _emc_latlon_sales = require("./emc_latlon_sales");
var _emc_login_history = require("./emc_login_history");
var _emc_notifikasi = require("./emc_notifikasi");
var _emc_order = require("./emc_order");
var _emc_order_detail = require("./emc_order_detail");
var _emc_order_detailz = require("./emc_order_detailz");
var _emc_order_invoice = require("./emc_order_invoice");
var _emc_order_invoice_details = require("./emc_order_invoice_details");
var _emc_order_logs = require("./emc_order_logs");
var _emc_order_payment = require("./emc_order_payment");
var _emc_order_status = require("./emc_order_status");
var _emc_orderz = require("./emc_orderz");
var _emc_promo = require("./emc_promo");
var _emc_promo_history = require("./emc_promo_history");
var _emc_province = require("./emc_province");
var _emc_retail = require("./emc_retail");
var _emc_static = require("./emc_static");
var _emc_status_master = require("./emc_status_master");
var _emc_subdistrict = require("./emc_subdistrict");
var _emc_temp = require("./emc_temp");
var _emc_uang_jalan = require("./emc_uang_jalan");
var _emc_uang_jalan_order = require("./emc_uang_jalan_order");
var _emcawb = require("./emcawb");
var _emcfoto = require("./emcfoto");
var _emcstatus = require("./emcstatus");
var _emctracking = require("./emctracking");
var _gps_event_logs = require("./gps_event_logs");
var _erl_brench = require("./erl_brench");
var _erl_brench_rep = require("./erl_brench_rep");
var _history = require("./history");
var _history_pengiriman = require("./history_pengiriman");
var _invoice_customer = require("./invoice_customer");
var _invoice_vendor = require("./invoice_vendor");
var _it_asset = require("./it_asset");
var _it_asset_brand = require("./it_asset_brand");
var _it_asset_code = require("./it_asset_code");
var _it_asset_history = require("./it_asset_history");
var _it_asset_permintaan_inventaris = require("./it_asset_permintaan_inventaris");
var _it_asset_permintaan_inventaris_spesifikasi = require("./it_asset_permintaan_inventaris_spesifikasi");
var _it_asset_serahterima = require("./it_asset_serahterima");
var _it_asset_spesifikasi = require("./it_asset_spesifikasi");
var _it_chat = require("./it_chat");
var _it_helpdesk = require("./it_helpdesk");
var _it_helpdesk_comment = require("./it_helpdesk_comment");
var _it_helpdesk_status = require("./it_helpdesk_status");
var _it_pengadaan_inventaris = require("./it_pengadaan_inventaris");
var _it_pengajuan = require("./it_pengajuan");
var _it_performance_target = require("./it_performance_target");
var _it_server = require("./it_server");
var _it_ticket = require("./it_ticket");
var _jenis_pengiriman = require("./jenis_pengiriman");
var _karyawan = require("./karyawan");
var _kategori = require("./kategori");
var _kecamatan = require("./kecamatan");
var _kendaraan = require("./kendaraan");
var _kendaraan_check_master = require("./kendaraan_check_master");
var _kendaraan_jenis = require("./kendaraan_jenis");
var _kendaraan_jenis_race = require("./kendaraan_jenis_race");
var _kendaraan_kondisi = require("./kendaraan_kondisi");
var _kendaraan_sewa_dedicated = require("./kendaraan_sewa_dedicated");
var _kendaraanstatus = require("./kendaraanstatus");
var _kendaraanstatusold = require("./kendaraanstatusold");
var _kota = require("./kota");
var _kpu = require("./kpu");
var _kpu_dapil = require("./kpu_dapil");
var _laporan_elogs2021 = require("./laporan_elogs2021");
var _laporan_elogs2022 = require("./laporan_elogs2022");
var _laporan_elogs2023 = require("./laporan_elogs2023");
var _laporan_race2021 = require("./laporan_race2021");
var _laporan_race2022 = require("./laporan_race2022");
var _laporan_race2023 = require("./laporan_race2023");
var _m_ap = require("./m_ap");
var _m_ap_biaya = require("./m_ap_biaya");
var _m_ap_biaya_detail = require("./m_ap_biaya_detail");
var _m_ap_detail = require("./m_ap_detail");
var _m_ap_noar = require("./m_ap_noar");
var _m_ap_pengajuan = require("./m_ap_pengajuan");
var _m_ap_pengajuan_detail = require("./m_ap_pengajuan_detail");
var _m_ap_personal = require("./m_ap_personal");
var _m_ap_personal_detail = require("./m_ap_personal_detail");
var _m_ap_temp = require("./m_ap_temp");
var _m_ar = require("./m_ar");
var _m_ar_addon = require("./m_ar_addon");
var _m_ar_addon_detail = require("./m_ar_addon_detail");
var _m_ar_addon_type = require("./m_ar_addon_type");
var _m_ar_billing = require("./m_ar_billing");
var _m_ar_detail = require("./m_ar_detail");
var _m_ar_history = require("./m_ar_history");
var _m_ar_payment = require("./m_ar_payment");
var _m_ar_payment_detail = require("./m_ar_payment_detail");
var _m_ar_personal = require("./m_ar_personal");
var _m_ar_personal_detail = require("./m_ar_personal_detail");
var _m_ar_real = require("./m_ar_real");
var _m_bu = require("./m_bu");
var _m_bu_brench = require("./m_bu_brench");
var _m_bu_employee = require("./m_bu_employee");
var _m_bu_employee_department = require("./m_bu_employee_department");
var _m_bu_employee_position = require("./m_bu_employee_position");
var _m_chat = require("./m_chat");
var _m_chat_email = require("./m_chat_email");
var _m_chat_internal = require("./m_chat_internal");
var _m_chat_internal_status = require("./m_chat_internal_status");
var _m_collector_agedhutang = require("./m_collector_agedhutang");
var _m_collector_agedpiutang = require("./m_collector_agedpiutang");
var _m_collector_bank_keluar = require("./m_collector_bank_keluar");
var _m_collector_bank_masuk = require("./m_collector_bank_masuk");
var _m_collector_jenis_pembayaran_customer = require("./m_collector_jenis_pembayaran_customer");
var _m_collector_jenis_pembayaran_vendor = require("./m_collector_jenis_pembayaran_vendor");
var _m_collector_pembayaran_customer = require("./m_collector_pembayaran_customer");
var _m_collector_pembayaran_customer_detail = require("./m_collector_pembayaran_customer_detail");
var _m_collector_pembayaran_vendor = require("./m_collector_pembayaran_vendor");
var _m_collector_pembayaran_vendor_detail = require("./m_collector_pembayaran_vendor_detail");
var _m_collector_uang_masuk = require("./m_collector_uang_masuk");
var _m_complaint = require("./m_complaint");
var _m_complaint_comment = require("./m_complaint_comment");
var _m_complaint_type = require("./m_complaint_type");
var _m_customer = require("./m_customer");
var _m_customer_chat = require("./m_customer_chat");
var _m_customer_claim_point = require("./m_customer_claim_point");
var _m_customer_record = require("./m_customer_record");
var _m_driver = require("./m_driver");
var _m_driver_chat = require("./m_driver_chat");
var _m_driver_claim_point = require("./m_driver_claim_point");
var _m_driver_emergency = require("./m_driver_emergency");
var _m_driver_history_point = require("./m_driver_history_point");
var _m_driver_info = require("./m_driver_info");
var _m_driver_locations = require("./m_driver_locations");
var _m_driver_order = require("./m_driver_order");
var _m_driver_perbaikan = require("./m_driver_perbaikan");
var _m_driver_perbaikan_detail = require("./m_driver_perbaikan_detail");
var _m_foto = require("./m_foto");
var _m_gps_record = require("./m_gps_record");
var _m_history_berat = require("./m_history_berat");
var _m_info = require("./m_info");
var _m_info_category = require("./m_info_category");
var _m_info_comment = require("./m_info_comment");
var _m_karyawan = require("./m_karyawan");
var _m_kota = require("./m_kota");
var _m_laporan_emc = require("./m_laporan_emc");
var _m_lelang = require("./m_lelang");
var _m_mastercollector_uang_masuk = require("./m_mastercollector_uang_masuk");
var _m_mitra = require("./m_mitra");
var _m_notif = require("./m_notif");
var _m_operasional_uang_jalan = require("./m_operasional_uang_jalan");
var _m_operasional_uang_jalan_detail = require("./m_operasional_uang_jalan_detail");
var _m_ops_pengajuan_keur = require("./m_ops_pengajuan_keur");
var _m_ops_pengajuan_keur_detail = require("./m_ops_pengajuan_keur_detail");
var _m_pengadaan = require("./m_pengadaan");
var _m_pengadaan_approve = require("./m_pengadaan_approve");
var _m_pengadaan_comment = require("./m_pengadaan_comment");
var _m_pengadaan_cus = require("./m_pengadaan_cus");
var _m_pengadaan_detail = require("./m_pengadaan_detail");
var _m_pengadaan_detail_cus = require("./m_pengadaan_detail_cus");
var _m_pengadaan_do = require("./m_pengadaan_do");
var _m_pengadaan_mitra = require("./m_pengadaan_mitra");
var _m_pengadaan_multimuat = require("./m_pengadaan_multimuat");
var _m_pengadaan_race = require("./m_pengadaan_race");
var _m_pengajuan = require("./m_pengajuan");
var _m_pengajuan_biaya = require("./m_pengajuan_biaya");
var _m_pengajuan_catatan = require("./m_pengajuan_catatan");
var _m_pengajuan_driver = require("./m_pengajuan_driver");
var _m_pengajuan_driver_trf = require("./m_pengajuan_driver_trf");
var _m_pengajuan_file = require("./m_pengajuan_file");
var _m_pengajuan_otorisasi = require("./m_pengajuan_otorisasi");
var _m_pengajuan_type = require("./m_pengajuan_type");
var _m_pengajuan_users = require("./m_pengajuan_users");
var _m_performance_aspek = require("./m_performance_aspek");
var _m_performance_employee = require("./m_performance_employee");
var _m_performance_type = require("./m_performance_type");
var _m_po = require("./m_po");
var _m_po_coment = require("./m_po_coment");
var _m_po_detail = require("./m_po_detail");
var _m_pool = require("./m_pool");
var _pool_activity_log = require("./pool_activity_log");
var _m_promo = require("./m_promo");
var _m_purch_invoice = require("./m_purch_invoice");
var _m_purch_invoice_pembayaran = require("./m_purch_invoice_pembayaran");
var _m_purch_unit = require("./m_purch_unit");
var _m_purch_unitpakai = require("./m_purch_unitpakai");
var _m_questionnaire = require("./m_questionnaire");
var _m_req_asuransi = require("./m_req_asuransi");
var _m_req_asuransi_detail = require("./m_req_asuransi_detail");
var _m_request_price = require("./m_request_price");
var _m_request_unit = require("./m_request_unit");
var _m_ritase = require("./m_ritase");
var _m_shipment = require("./m_shipment");
var _m_sm = require("./m_sm");
var _m_sm_diterima = require("./m_sm_diterima");
var _m_sm_kondisi_barang = require("./m_sm_kondisi_barang");
var _m_sm_photo = require("./m_sm_photo");
var _m_sm_real = require("./m_sm_real");
var _m_sm_receive = require("./m_sm_receive");
  var _m_sm_receive_check = require("./m_sm_receive_check");
  var _m_sm_cost = require("./m_sm_cost");
  var _m_sm_retur = require("./m_sm_retur");
  var _m_sm_retur_detail = require("./m_sm_retur_detail");
  var _m_sm_status = require("./m_sm_status");
  var _m_sm_test = require("./m_sm_test");
  var _m_smu = require("./m_smu");
var _m_status = require("./m_status");
var _m_status_chat = require("./m_status_chat");
var _m_status_complaint = require("./m_status_complaint");
var _m_status_master = require("./m_status_master");
var _m_status_order = require("./m_status_order");
var _m_status_vehicle = require("./m_status_vehicle");
var _m_target = require("./m_target");
var _m_tarif_customer = require("./m_tarif_customer");
var _m_tarif_eureka = require("./m_tarif_eureka");
var _m_tarif_mitra = require("./m_tarif_mitra");
var _m_task = require("./m_task");
var _m_task_holiday = require("./m_task_holiday");
var _m_taskrespon = require("./m_taskrespon");
var _m_vehicle = require("./m_vehicle");
var _m_vehicle_position = require("./m_vehicle_position");
var _m_vehicle_status = require("./m_vehicle_status");
var _m_voucher = require("./m_voucher");
var _m_wil_kecamatan = require("./m_wil_kecamatan");
var _m_wil_kota = require("./m_wil_kota");
var _m_wil_provinsi = require("./m_wil_provinsi");
var _mainmenu = require("./mainmenu");
var _massage_do = require("./massage_do");
var _mitra = require("./mitra");
var _mitra_chat = require("./mitra_chat");
var _mitra_complaint = require("./mitra_complaint");
var _mitra_driver = require("./mitra_driver");
var _mitra_fee = require("./mitra_fee");
var _mitra_mail = require("./mitra_mail");
var _mitra_md = require("./mitra_md");
var _mitra_md_cabang = require("./mitra_md_cabang");
var _mitra_md_kategori = require("./mitra_md_kategori");
var _mitra_md_pic = require("./mitra_md_pic");
var _mitra_md_produk = require("./mitra_md_produk");
var _mitra_norekcabang = require("./mitra_norekcabang");
var _mitra_pic = require("./mitra_pic");
var _mitra_vehicle = require("./mitra_vehicle");
var _modul = require("./modul");
var _mp_customer = require("./mp_customer");
var _mp_customer_gak_pake = require("./mp_customer_gak_pake");
var _mp_jenis_barang = require("./mp_jenis_barang");
var _mp_muatan = require("./mp_muatan");
var _mp_muatan_kiriman = require("./mp_muatan_kiriman");
var _mp_muatan_kiriman_detail = require("./mp_muatan_kiriman_detail");
var _mp_muatan_order = require("./mp_muatan_order");
var _mp_muatan_order_riwayat = require("./mp_muatan_order_riwayat");
var _mp_muatan_order_status = require("./mp_muatan_order_status");
var _mp_notifikasi = require("./mp_notifikasi");
var _mp_produk = require("./mp_produk");
var _mp_truk = require("./mp_truk");
var _mp_truk_kategori = require("./mp_truk_kategori");
var _mp_vendor = require("./mp_vendor");
var _mp_vendor_truk = require("./mp_vendor_truk");
var _my_bank = require("./my_bank");
var _n_customer = require("./n_customer");
var _n_customer_chat = require("./n_customer_chat");
var _n_request = require("./n_request");
var _packing = require("./packing");
var _pengadaan_unit = require("./pengadaan_unit");
var _po_purchasing = require("./po_purchasing");
var _pro_poposal_catatan = require("./pro_poposal_catatan");
var _pro_proposal = require("./pro_proposal");
var _pro_proposal_ttd = require("./pro_proposal_ttd");
var _provinsi = require("./provinsi");
var _push_notification = require("./push_notification");
var _pw_harian = require("./pw_harian");
var _quot_ket = require("./quot_ket");
var _quot_tarif = require("./quot_tarif");
var _race_ptj = require("./race_ptj");
var _reward = require("./reward");
var _smstatus = require("./smstatus");
var _spk = require("./spk");
var _statistik = require("./statistik");
var _submenu = require("./submenu");
var _supirstatus = require("./supirstatus");
var _surat_muat = require("./surat_muat");
var _target_penjualan = require("./target_penjualan");
var _tarif = require("./tarif");
var _tarif_customer = require("./tarif_customer");
var _tarif_emc = require("./tarif_emc");
var _tarif_erlangga = require("./tarif_erlangga");
var _tarif_jne = require("./tarif_jne");
var _tarif_non_erlangga = require("./tarif_non_erlangga");
var _top = require("./top");
var _topstatus = require("./topstatus");
var _traffic_customer = require("./traffic_customer");
var _tsm = require("./tsm");
var _uang_jalan = require("./uang_jalan");
var _uang_jalan_periode = require("./uang_jalan_periode");
var _uang_jalan_periode_detail = require("./uang_jalan_periode_detail");
var _uang_jalan_ptj = require("./uang_jalan_ptj");
var _uang_jalan_race = require("./uang_jalan_race");
var _updt_total_mpd = require("./updt_total_mpd");
var _usergroups = require("./usergroups");
var _users = require("./users");
var _users_group = require("./users_group");
var _users_level = require("./users_level");
var _users_perusahaan = require("./users_perusahaan");
var _userslevel = require("./userslevel");
var _wm_complaint = require("./wm_complaint");

function initModels(sequelize) {
  var act_acount = _act_acount(sequelize, DataTypes);
  var act_dept = _act_dept(sequelize, DataTypes);
  var act_gl = _act_gl(sequelize, DataTypes);
  var act_gl_detail = _act_gl_detail(sequelize, DataTypes);
  var act_juornal_detail = _act_juornal_detail(sequelize, DataTypes);
  var act_pajak = _act_pajak(sequelize, DataTypes);
  var act_pajak_pembatalan = _act_pajak_pembatalan(sequelize, DataTypes);
  var act_sop = _act_sop(sequelize, DataTypes);
  var act_sop_lampiran = _act_sop_lampiran(sequelize, DataTypes);
  var alamat = _alamat(sequelize, DataTypes);
  var alamat_fee = _alamat_fee(sequelize, DataTypes);
  var alamat_fee_history = _alamat_fee_history(sequelize, DataTypes);
  var alamat_po = _alamat_po(sequelize, DataTypes);
  var alamat_ritase = _alamat_ritase(sequelize, DataTypes);
  var armada = _armada(sequelize, DataTypes);
  var armadaa = _armadaa(sequelize, DataTypes);
  var awb = _awb(sequelize, DataTypes);
  var bbm_price = _bbm_price(sequelize, DataTypes);
  var berita = _berita(sequelize, DataTypes);
  var blog_article = _blog_article(sequelize, DataTypes);
  var blog_image = _blog_image(sequelize, DataTypes);
  var blog_partial = _blog_partial(sequelize, DataTypes);
  var blog_partial_sub = _blog_partial_sub(sequelize, DataTypes);
  var blog_settings = _blog_settings(sequelize, DataTypes);
  var cabang = _cabang(sequelize, DataTypes);
  var chat = _chat(sequelize, DataTypes);
  var chat_driver = _chat_driver(sequelize, DataTypes);
  var ci_sessions = _ci_sessions(sequelize, DataTypes);
  var collector_purchase_invoices = _collector_purchase_invoices(sequelize, DataTypes);
  var collector_purchase_payments = _collector_purchase_payments(sequelize, DataTypes);
  var collector_purchase_payments_records = _collector_purchase_payments_records(sequelize, DataTypes);
  var collector_receive_payment = _collector_receive_payment(sequelize, DataTypes);
  var collector_receive_payment_record = _collector_receive_payment_record(sequelize, DataTypes);
  var collector_sales_invoices = _collector_sales_invoices(sequelize, DataTypes);
  var command_center_fcm_tokens = _command_center_fcm_tokens(sequelize, DataTypes);
  var config = _config(sequelize, DataTypes);
  var customer = _customer(sequelize, DataTypes);
  var customer_info = _customer_info(sequelize, DataTypes);
  var customer_npwp = _customer_npwp(sequelize, DataTypes);
  var customer_price = _customer_price(sequelize, DataTypes);
  var customer_policy = _customer_policy(sequelize, DataTypes);
  var d_customer = _d_customer(sequelize, DataTypes);
  var dev_emc_address = _dev_emc_address(sequelize, DataTypes);
  var dev_emc_order = _dev_emc_order(sequelize, DataTypes);
  var dev_emc_order_detail = _dev_emc_order_detail(sequelize, DataTypes);
  var ebh_area = _ebh_area(sequelize, DataTypes);
  var ebh_category_sub = _ebh_category_sub(sequelize, DataTypes);
  var ebh_category_utama = _ebh_category_utama(sequelize, DataTypes);
  var ebh_product = _ebh_product(sequelize, DataTypes);
  var ebh_product_stock = _ebh_product_stock(sequelize, DataTypes);
  var emc_address = _emc_address(sequelize, DataTypes);
  var emc_chat = _emc_chat(sequelize, DataTypes);
  var emc_city = _emc_city(sequelize, DataTypes);
  var emc_config = _emc_config(sequelize, DataTypes);
  var emc_cus = _emc_cus(sequelize, DataTypes);
  var emc_customer = _emc_customer(sequelize, DataTypes);
  var emc_customer_chat = _emc_customer_chat(sequelize, DataTypes);
  var emc_customer_company = _emc_customer_company(sequelize, DataTypes);
  var emc_customer_log = _emc_customer_log(sequelize, DataTypes);
  var emc_customer_referral = _emc_customer_referral(sequelize, DataTypes);
  var emc_customer_voucher = _emc_customer_voucher(sequelize, DataTypes);
  var emc_driver = _emc_driver(sequelize, DataTypes);
  var emc_driver_chat = _emc_driver_chat(sequelize, DataTypes);
  var emc_driver_chat_customer = _emc_driver_chat_customer(sequelize, DataTypes);
  var emc_driver_claim_point = _emc_driver_claim_point(sequelize, DataTypes);
  var emc_driver_emergency = _emc_driver_emergency(sequelize, DataTypes);
  var emc_driver_income = _emc_driver_income(sequelize, DataTypes);
  var emc_driver_locations = _emc_driver_locations(sequelize, DataTypes);
  var emc_driver_order = _emc_driver_order(sequelize, DataTypes);
  var emc_fees = _emc_fees(sequelize, DataTypes);
  var emc_history_deposit = _emc_history_deposit(sequelize, DataTypes);
  var emc_history_payment = _emc_history_payment(sequelize, DataTypes);
  var emc_jne_awb = _emc_jne_awb(sequelize, DataTypes);
  var emc_jne_city = _emc_jne_city(sequelize, DataTypes);
  var emc_jne_kode = _emc_jne_kode(sequelize, DataTypes);
  var emc_jne_province = _emc_jne_province(sequelize, DataTypes);
  var emc_jne_subdistrict = _emc_jne_subdistrict(sequelize, DataTypes);
  var emc_jne_tarif = _emc_jne_tarif(sequelize, DataTypes);
  var emc_latlon_sales = _emc_latlon_sales(sequelize, DataTypes);
  var emc_login_history = _emc_login_history(sequelize, DataTypes);
  var emc_notifikasi = _emc_notifikasi(sequelize, DataTypes);
  var emc_order = _emc_order(sequelize, DataTypes);
  var emc_order_detail = _emc_order_detail(sequelize, DataTypes);
  var emc_order_detailz = _emc_order_detailz(sequelize, DataTypes);
  var emc_order_invoice = _emc_order_invoice(sequelize, DataTypes);
  var emc_order_invoice_details = _emc_order_invoice_details(sequelize, DataTypes);
  var emc_order_logs = _emc_order_logs(sequelize, DataTypes);
  var emc_order_payment = _emc_order_payment(sequelize, DataTypes);
  var emc_order_status = _emc_order_status(sequelize, DataTypes);
  var emc_orderz = _emc_orderz(sequelize, DataTypes);
  var emc_promo = _emc_promo(sequelize, DataTypes);
  var emc_promo_history = _emc_promo_history(sequelize, DataTypes);
  var emc_province = _emc_province(sequelize, DataTypes);
  var emc_retail = _emc_retail(sequelize, DataTypes);
  var emc_static = _emc_static(sequelize, DataTypes);
  var emc_status_master = _emc_status_master(sequelize, DataTypes);
  var emc_subdistrict = _emc_subdistrict(sequelize, DataTypes);
  var emc_temp = _emc_temp(sequelize, DataTypes);
  var emc_uang_jalan = _emc_uang_jalan(sequelize, DataTypes);
  var emc_uang_jalan_order = _emc_uang_jalan_order(sequelize, DataTypes);
  var emcawb = _emcawb(sequelize, DataTypes);
  var emcfoto = _emcfoto(sequelize, DataTypes);
  var emcstatus = _emcstatus(sequelize, DataTypes);
  var emctracking = _emctracking(sequelize, DataTypes);
  var gps_event_logs = _gps_event_logs(sequelize, DataTypes);
  var m_sm_retur_history = _m_sm_retur_history(sequelize, DataTypes);
  var erl_brench = _erl_brench(sequelize, DataTypes);
  var erl_brench_rep = _erl_brench_rep(sequelize, DataTypes);
  var history = _history(sequelize, DataTypes);
  var history_pengiriman = _history_pengiriman(sequelize, DataTypes);
  var invoice_customer = _invoice_customer(sequelize, DataTypes);
  var invoice_vendor = _invoice_vendor(sequelize, DataTypes);
  var it_asset = _it_asset(sequelize, DataTypes);
  var it_asset_brand = _it_asset_brand(sequelize, DataTypes);
  var it_asset_code = _it_asset_code(sequelize, DataTypes);
  var it_asset_history = _it_asset_history(sequelize, DataTypes);
  var it_asset_permintaan_inventaris = _it_asset_permintaan_inventaris(sequelize, DataTypes);
  var it_asset_permintaan_inventaris_spesifikasi = _it_asset_permintaan_inventaris_spesifikasi(sequelize, DataTypes);
  var it_asset_serahterima = _it_asset_serahterima(sequelize, DataTypes);
  var it_asset_spesifikasi = _it_asset_spesifikasi(sequelize, DataTypes);
  var it_chat = _it_chat(sequelize, DataTypes);
  var it_helpdesk = _it_helpdesk(sequelize, DataTypes);
  var it_helpdesk_comment = _it_helpdesk_comment(sequelize, DataTypes);
  var it_helpdesk_status = _it_helpdesk_status(sequelize, DataTypes);
  var it_pengadaan_inventaris = _it_pengadaan_inventaris(sequelize, DataTypes);
  var it_pengajuan = _it_pengajuan(sequelize, DataTypes);
  var it_performance_target = _it_performance_target(sequelize, DataTypes);
  var it_server = _it_server(sequelize, DataTypes);
  var it_ticket = _it_ticket(sequelize, DataTypes);
  var jenis_pengiriman = _jenis_pengiriman(sequelize, DataTypes);
  var karyawan = _karyawan(sequelize, DataTypes);
  var kategori = _kategori(sequelize, DataTypes);
  var kecamatan = _kecamatan(sequelize, DataTypes);
  var kendaraan = _kendaraan(sequelize, DataTypes);
  var kendaraan_check_master = _kendaraan_check_master(sequelize, DataTypes);
  var kendaraan_jenis = _kendaraan_jenis(sequelize, DataTypes);
  var kendaraan_jenis_race = _kendaraan_jenis_race(sequelize, DataTypes);
  var kendaraan_kondisi = _kendaraan_kondisi(sequelize, DataTypes);
  var kendaraan_sewa_dedicated = _kendaraan_sewa_dedicated(sequelize, DataTypes);
  var kendaraanstatus = _kendaraanstatus(sequelize, DataTypes);
  var kendaraanstatusold = _kendaraanstatusold(sequelize, DataTypes);
  var kota = _kota(sequelize, DataTypes);
  var kpu = _kpu(sequelize, DataTypes);
  var kpu_dapil = _kpu_dapil(sequelize, DataTypes);
  var laporan_elogs2021 = _laporan_elogs2021(sequelize, DataTypes);
  var laporan_elogs2022 = _laporan_elogs2022(sequelize, DataTypes);
  var laporan_elogs2023 = _laporan_elogs2023(sequelize, DataTypes);
  var laporan_race2021 = _laporan_race2021(sequelize, DataTypes);
  var laporan_race2022 = _laporan_race2022(sequelize, DataTypes);
  var laporan_race2023 = _laporan_race2023(sequelize, DataTypes);
  var m_ap = _m_ap(sequelize, DataTypes);
  var m_ap_biaya = _m_ap_biaya(sequelize, DataTypes);
  var m_ap_biaya_detail = _m_ap_biaya_detail(sequelize, DataTypes);
  var m_ap_detail = _m_ap_detail(sequelize, DataTypes);
  var m_ap_noar = _m_ap_noar(sequelize, DataTypes);
  var m_ap_pengajuan = _m_ap_pengajuan(sequelize, DataTypes);
  var m_ap_pengajuan_detail = _m_ap_pengajuan_detail(sequelize, DataTypes);
  var m_ap_personal = _m_ap_personal(sequelize, DataTypes);
  var m_ap_personal_detail = _m_ap_personal_detail(sequelize, DataTypes);
  var m_ap_temp = _m_ap_temp(sequelize, DataTypes);
  var m_ar = _m_ar(sequelize, DataTypes);
  var m_ar_addon = _m_ar_addon(sequelize, DataTypes);
  var m_ar_addon_detail = _m_ar_addon_detail(sequelize, DataTypes);
  var m_ar_addon_type = _m_ar_addon_type(sequelize, DataTypes);
  var m_ar_billing = _m_ar_billing(sequelize, DataTypes);
  var m_ar_detail = _m_ar_detail(sequelize, DataTypes);
  var m_ar_history = _m_ar_history(sequelize, DataTypes);
  var m_ar_payment = _m_ar_payment(sequelize, DataTypes);
  var m_ar_payment_detail = _m_ar_payment_detail(sequelize, DataTypes);
  var m_ar_personal = _m_ar_personal(sequelize, DataTypes);
  var m_ar_personal_detail = _m_ar_personal_detail(sequelize, DataTypes);
  var m_ar_real = _m_ar_real(sequelize, DataTypes);
  var m_bu = _m_bu(sequelize, DataTypes);
  var m_bu_brench = _m_bu_brench(sequelize, DataTypes);
  var m_bu_employee = _m_bu_employee(sequelize, DataTypes);
  var m_bu_employee_department = _m_bu_employee_department(sequelize, DataTypes);
  var m_bu_employee_position = _m_bu_employee_position(sequelize, DataTypes);
  var m_chat = _m_chat(sequelize, DataTypes);
  var m_chat_email = _m_chat_email(sequelize, DataTypes);
  var m_chat_internal = _m_chat_internal(sequelize, DataTypes);
  var m_chat_internal_status = _m_chat_internal_status(sequelize, DataTypes);
  var m_collector_agedhutang = _m_collector_agedhutang(sequelize, DataTypes);
  var m_collector_agedpiutang = _m_collector_agedpiutang(sequelize, DataTypes);
  var m_collector_bank_keluar = _m_collector_bank_keluar(sequelize, DataTypes);
  var m_collector_bank_masuk = _m_collector_bank_masuk(sequelize, DataTypes);
  var m_collector_jenis_pembayaran_customer = _m_collector_jenis_pembayaran_customer(sequelize, DataTypes);
  var m_collector_jenis_pembayaran_vendor = _m_collector_jenis_pembayaran_vendor(sequelize, DataTypes);
  var m_collector_pembayaran_customer = _m_collector_pembayaran_customer(sequelize, DataTypes);
  var m_collector_pembayaran_customer_detail = _m_collector_pembayaran_customer_detail(sequelize, DataTypes);
  var m_collector_pembayaran_vendor = _m_collector_pembayaran_vendor(sequelize, DataTypes);
  var m_collector_pembayaran_vendor_detail = _m_collector_pembayaran_vendor_detail(sequelize, DataTypes);
  var m_collector_uang_masuk = _m_collector_uang_masuk(sequelize, DataTypes);
  var m_complaint = _m_complaint(sequelize, DataTypes);
  var m_complaint_comment = _m_complaint_comment(sequelize, DataTypes);
  var m_complaint_type = _m_complaint_type(sequelize, DataTypes);
  var m_customer = _m_customer(sequelize, DataTypes);
  var m_customer_chat = _m_customer_chat(sequelize, DataTypes);
  var m_customer_claim_point = _m_customer_claim_point(sequelize, DataTypes);
  var m_customer_record = _m_customer_record(sequelize, DataTypes);
  var m_driver = _m_driver(sequelize, DataTypes);
  var m_driver_chat = _m_driver_chat(sequelize, DataTypes);
  var m_driver_claim_point = _m_driver_claim_point(sequelize, DataTypes);
  var m_driver_emergency = _m_driver_emergency(sequelize, DataTypes);
  var m_driver_history_point = _m_driver_history_point(sequelize, DataTypes);
  var m_driver_info = _m_driver_info(sequelize, DataTypes);
  var m_driver_locations = _m_driver_locations(sequelize, DataTypes);
  var m_driver_order = _m_driver_order(sequelize, DataTypes);
  var m_driver_perbaikan = _m_driver_perbaikan(sequelize, DataTypes);
  var m_driver_perbaikan_detail = _m_driver_perbaikan_detail(sequelize, DataTypes);
  var m_foto = _m_foto(sequelize, DataTypes);
  var m_gps_record = _m_gps_record(sequelize, DataTypes);
  var m_history_berat = _m_history_berat(sequelize, DataTypes);
  var m_info = _m_info(sequelize, DataTypes);
  var m_info_category = _m_info_category(sequelize, DataTypes);
  var m_info_comment = _m_info_comment(sequelize, DataTypes);
  var m_karyawan = _m_karyawan(sequelize, DataTypes);
  var m_kota = _m_kota(sequelize, DataTypes);
  var m_laporan_emc = _m_laporan_emc(sequelize, DataTypes);
  var m_lelang = _m_lelang(sequelize, DataTypes);
  var m_mastercollector_uang_masuk = _m_mastercollector_uang_masuk(sequelize, DataTypes);
  var m_mitra = _m_mitra(sequelize, DataTypes);
  var m_notif = _m_notif(sequelize, DataTypes);
  var m_operasional_uang_jalan = _m_operasional_uang_jalan(sequelize, DataTypes);
  var m_operasional_uang_jalan_detail = _m_operasional_uang_jalan_detail(sequelize, DataTypes);
  var m_ops_pengajuan_keur = _m_ops_pengajuan_keur(sequelize, DataTypes);
  var m_ops_pengajuan_keur_detail = _m_ops_pengajuan_keur_detail(sequelize, DataTypes);
  var m_pengadaan = _m_pengadaan(sequelize, DataTypes);
  var m_pengadaan_approve = _m_pengadaan_approve(sequelize, DataTypes);
  var m_pengadaan_comment = _m_pengadaan_comment(sequelize, DataTypes);
  var m_pengadaan_cus = _m_pengadaan_cus(sequelize, DataTypes);
  var m_pengadaan_detail = _m_pengadaan_detail(sequelize, DataTypes);
  var m_pengadaan_detail_cus = _m_pengadaan_detail_cus(sequelize, DataTypes);
  var m_pengadaan_do = _m_pengadaan_do(sequelize, DataTypes);
  var m_pengadaan_mitra = _m_pengadaan_mitra(sequelize, DataTypes);
  var m_pengadaan_multimuat = _m_pengadaan_multimuat(sequelize, DataTypes);
  var m_pengadaan_race = _m_pengadaan_race(sequelize, DataTypes);
  var m_pengajuan = _m_pengajuan(sequelize, DataTypes);
  var m_pengajuan_biaya = _m_pengajuan_biaya(sequelize, DataTypes);
  var m_pengajuan_catatan = _m_pengajuan_catatan(sequelize, DataTypes);
  var m_pengajuan_driver = _m_pengajuan_driver(sequelize, DataTypes);
  var m_pengajuan_driver_trf = _m_pengajuan_driver_trf(sequelize, DataTypes);
  var m_pengajuan_file = _m_pengajuan_file(sequelize, DataTypes);
  var m_pengajuan_otorisasi = _m_pengajuan_otorisasi(sequelize, DataTypes);
  var m_pengajuan_type = _m_pengajuan_type(sequelize, DataTypes);
  var m_pengajuan_users = _m_pengajuan_users(sequelize, DataTypes);
  var m_performance_aspek = _m_performance_aspek(sequelize, DataTypes);
  var m_performance_employee = _m_performance_employee(sequelize, DataTypes);
  var m_performance_type = _m_performance_type(sequelize, DataTypes);
  var m_po = _m_po(sequelize, DataTypes);
  var m_po_coment = _m_po_coment(sequelize, DataTypes);
  var m_po_detail = _m_po_detail(sequelize, DataTypes);
  var m_pool = _m_pool(sequelize, DataTypes);
  var pool_activity_log = _pool_activity_log(sequelize, DataTypes);
  var m_promo = _m_promo(sequelize, DataTypes);
  var m_purch_invoice = _m_purch_invoice(sequelize, DataTypes);
  var m_purch_invoice_pembayaran = _m_purch_invoice_pembayaran(sequelize, DataTypes);
  var m_purch_unit = _m_purch_unit(sequelize, DataTypes);
  var m_purch_unitpakai = _m_purch_unitpakai(sequelize, DataTypes);
  var m_questionnaire = _m_questionnaire(sequelize, DataTypes);
  var m_req_asuransi = _m_req_asuransi(sequelize, DataTypes);
  var m_req_asuransi_detail = _m_req_asuransi_detail(sequelize, DataTypes);
  var m_request_price = _m_request_price(sequelize, DataTypes);
  var m_request_unit = _m_request_unit(sequelize, DataTypes);
  var m_ritase = _m_ritase(sequelize, DataTypes);
  var m_shipment = _m_shipment(sequelize, DataTypes);
  var m_sm = _m_sm(sequelize, DataTypes);
  var m_sm_diterima = _m_sm_diterima(sequelize, DataTypes);
  var m_sm_kondisi_barang = _m_sm_kondisi_barang(sequelize, DataTypes);
  var m_sm_photo = _m_sm_photo(sequelize, DataTypes);
  var m_sm_real = _m_sm_real(sequelize, DataTypes);
  var m_sm_receive = _m_sm_receive(sequelize, DataTypes);
  var m_sm_receive_check = _m_sm_receive_check(sequelize, DataTypes);
  var m_sm_cost = _m_sm_cost(sequelize, DataTypes);
  var m_sm_retur = _m_sm_retur(sequelize, DataTypes);
  var m_sm_retur_detail = _m_sm_retur_detail(sequelize, DataTypes);
  var m_sm_status = _m_sm_status(sequelize, DataTypes);
  var m_sm_test = _m_sm_test(sequelize, DataTypes);
  var m_smu = _m_smu(sequelize, DataTypes);
  var m_status = _m_status(sequelize, DataTypes);
  var m_status_chat = _m_status_chat(sequelize, DataTypes);
  var m_status_complaint = _m_status_complaint(sequelize, DataTypes);
  var m_status_master = _m_status_master(sequelize, DataTypes);
  var m_status_order = _m_status_order(sequelize, DataTypes);
  var m_status_vehicle = _m_status_vehicle(sequelize, DataTypes);
  var m_target = _m_target(sequelize, DataTypes);
  var m_tarif_customer = _m_tarif_customer(sequelize, DataTypes);
  var m_tarif_eureka = _m_tarif_eureka(sequelize, DataTypes);
  var m_tarif_mitra = _m_tarif_mitra(sequelize, DataTypes);
  var m_task = _m_task(sequelize, DataTypes);
  var m_task_holiday = _m_task_holiday(sequelize, DataTypes);
  var m_taskrespon = _m_taskrespon(sequelize, DataTypes);
  var m_vehicle = _m_vehicle(sequelize, DataTypes);
  var m_vehicle_position = _m_vehicle_position(sequelize, DataTypes);
  var m_vehicle_status = _m_vehicle_status(sequelize, DataTypes);
  var m_voucher = _m_voucher(sequelize, DataTypes);
  var m_wil_kecamatan = _m_wil_kecamatan(sequelize, DataTypes);
  var m_wil_kota = _m_wil_kota(sequelize, DataTypes);
  var m_wil_provinsi = _m_wil_provinsi(sequelize, DataTypes);
  var mainmenu = _mainmenu(sequelize, DataTypes);
  var massage_do = _massage_do(sequelize, DataTypes);
  var mitra = _mitra(sequelize, DataTypes);
  var mitra_chat = _mitra_chat(sequelize, DataTypes);
  var mitra_complaint = _mitra_complaint(sequelize, DataTypes);
  var mitra_driver = _mitra_driver(sequelize, DataTypes);
  var mitra_fee = _mitra_fee(sequelize, DataTypes);
  var mitra_mail = _mitra_mail(sequelize, DataTypes);
  var mitra_md = _mitra_md(sequelize, DataTypes);
  var mitra_md_cabang = _mitra_md_cabang(sequelize, DataTypes);
  var mitra_md_kategori = _mitra_md_kategori(sequelize, DataTypes);
  var mitra_md_pic = _mitra_md_pic(sequelize, DataTypes);
  var mitra_md_produk = _mitra_md_produk(sequelize, DataTypes);
  var mitra_norekcabang = _mitra_norekcabang(sequelize, DataTypes);
  var mitra_pic = _mitra_pic(sequelize, DataTypes);
  var mitra_vehicle = _mitra_vehicle(sequelize, DataTypes);
  var modul = _modul(sequelize, DataTypes);
  var mp_customer = _mp_customer(sequelize, DataTypes);
  var mp_customer_gak_pake = _mp_customer_gak_pake(sequelize, DataTypes);
  var mp_jenis_barang = _mp_jenis_barang(sequelize, DataTypes);
  var mp_muatan = _mp_muatan(sequelize, DataTypes);
  var mp_muatan_kiriman = _mp_muatan_kiriman(sequelize, DataTypes);
  var mp_muatan_kiriman_detail = _mp_muatan_kiriman_detail(sequelize, DataTypes);
  var mp_muatan_order = _mp_muatan_order(sequelize, DataTypes);
  var mp_muatan_order_riwayat = _mp_muatan_order_riwayat(sequelize, DataTypes);
  var mp_muatan_order_status = _mp_muatan_order_status(sequelize, DataTypes);
  var mp_notifikasi = _mp_notifikasi(sequelize, DataTypes);
  var mp_produk = _mp_produk(sequelize, DataTypes);
  var mp_truk = _mp_truk(sequelize, DataTypes);
  var mp_truk_kategori = _mp_truk_kategori(sequelize, DataTypes);
  var mp_vendor = _mp_vendor(sequelize, DataTypes);
  var mp_vendor_truk = _mp_vendor_truk(sequelize, DataTypes);
  var my_bank = _my_bank(sequelize, DataTypes);
  var n_customer = _n_customer(sequelize, DataTypes);
  var n_customer_chat = _n_customer_chat(sequelize, DataTypes);
  var n_request = _n_request(sequelize, DataTypes);
  var packing = _packing(sequelize, DataTypes);
  var pengadaan_unit = _pengadaan_unit(sequelize, DataTypes);
  var po_purchasing = _po_purchasing(sequelize, DataTypes);
  var pro_poposal_catatan = _pro_poposal_catatan(sequelize, DataTypes);
  var pro_proposal = _pro_proposal(sequelize, DataTypes);
  var pro_proposal_ttd = _pro_proposal_ttd(sequelize, DataTypes);
  var provinsi = _provinsi(sequelize, DataTypes);
  var push_notification = _push_notification(sequelize, DataTypes);
  var pw_harian = _pw_harian(sequelize, DataTypes);
  var quot_ket = _quot_ket(sequelize, DataTypes);
  var quot_tarif = _quot_tarif(sequelize, DataTypes);
  var race_ptj = _race_ptj(sequelize, DataTypes);
  var reward = _reward(sequelize, DataTypes);
  var smstatus = _smstatus(sequelize, DataTypes);
  var spk = _spk(sequelize, DataTypes);
  var statistik = _statistik(sequelize, DataTypes);
  var submenu = _submenu(sequelize, DataTypes);
  var supirstatus = _supirstatus(sequelize, DataTypes);
  var surat_muat = _surat_muat(sequelize, DataTypes);
  var target_penjualan = _target_penjualan(sequelize, DataTypes);
  var tarif = _tarif(sequelize, DataTypes);
  var tarif_customer = _tarif_customer(sequelize, DataTypes);
  var tarif_emc = _tarif_emc(sequelize, DataTypes);
  var tarif_erlangga = _tarif_erlangga(sequelize, DataTypes);
  var tarif_jne = _tarif_jne(sequelize, DataTypes);
  var tarif_non_erlangga = _tarif_non_erlangga(sequelize, DataTypes);
  var top = _top(sequelize, DataTypes);
  var topstatus = _topstatus(sequelize, DataTypes);
  var traffic_customer = _traffic_customer(sequelize, DataTypes);
  var tsm = _tsm(sequelize, DataTypes);
  var uang_jalan = _uang_jalan(sequelize, DataTypes);
  var uang_jalan_periode = _uang_jalan_periode(sequelize, DataTypes);
  var uang_jalan_periode_detail = _uang_jalan_periode_detail(sequelize, DataTypes);
  var uang_jalan_ptj = _uang_jalan_ptj(sequelize, DataTypes);
  var uang_jalan_race = _uang_jalan_race(sequelize, DataTypes);
  var updt_total_mpd = _updt_total_mpd(sequelize, DataTypes);
  var usergroups = _usergroups(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var users_group = _users_group(sequelize, DataTypes);
  var users_level = _users_level(sequelize, DataTypes);
  var users_perusahaan = _users_perusahaan(sequelize, DataTypes);
  var userslevel = _userslevel(sequelize, DataTypes);
  var wm_complaint = _wm_complaint(sequelize, DataTypes);

  m_collector_pembayaran_vendor_detail.belongsTo(m_ap, { as: "id_ap_m_ap", foreignKey: "id_ap"});
  m_ap.hasMany(m_collector_pembayaran_vendor_detail, { as: "m_collector_pembayaran_vendor_details", foreignKey: "id_ap"});
  m_ar_addon_detail.belongsTo(m_ar_addon, { as: "addon", foreignKey: "addon_id"});
  m_ar_addon.hasMany(m_ar_addon_detail, { as: "m_ar_addon_details", foreignKey: "addon_id"});
  m_ar_addon.belongsTo(m_ar_addon_type, { as: "addon_type", foreignKey: "addon_type_id"});
  m_ar_addon_type.hasMany(m_ar_addon, { as: "m_ar_addons", foreignKey: "addon_type_id"});
  m_collector_pembayaran_vendor.belongsTo(m_collector_bank_keluar, { as: "id_bank_keluar_m_collector_bank_keluar", foreignKey: "id_bank_keluar"});
  m_collector_bank_keluar.hasMany(m_collector_pembayaran_vendor, { as: "m_collector_pembayaran_vendors", foreignKey: "id_bank_keluar"});
  m_collector_pembayaran_vendor.belongsTo(m_collector_jenis_pembayaran_vendor, { as: "id_jenis_m_collector_jenis_pembayaran_vendor", foreignKey: "id_jenis"});
  m_collector_jenis_pembayaran_vendor.hasMany(m_collector_pembayaran_vendor, { as: "m_collector_pembayaran_vendors", foreignKey: "id_jenis"});
  m_collector_pembayaran_vendor_detail.belongsTo(m_collector_pembayaran_vendor, { as: "id_pembayaran_vendor_m_collector_pembayaran_vendor", foreignKey: "id_pembayaran_vendor"});
  m_collector_pembayaran_vendor.hasMany(m_collector_pembayaran_vendor_detail, { as: "m_collector_pembayaran_vendor_details", foreignKey: "id_pembayaran_vendor"});
  kendaraan.belongsTo(m_driver, { as: "id_driver_m_driver", foreignKey: "id_driver"});
  m_driver.hasMany(kendaraan, { as: "kendaraans", foreignKey: "id_driver"});
  m_operasional_uang_jalan_detail.belongsTo(m_operasional_uang_jalan, { as: "id_uang_jalan_m_operasional_uang_jalan", foreignKey: "id_uang_jalan"});
  m_operasional_uang_jalan.hasMany(m_operasional_uang_jalan_detail, { as: "m_operasional_uang_jalan_details", foreignKey: "id_uang_jalan"});
  m_foto.belongsTo(m_pengadaan, { as: "id_mp_m_pengadaan", foreignKey: "id_mp"});
  m_pengadaan.hasMany(m_foto, { as: "m_fotos", foreignKey: "id_mp"});
  m_lelang.belongsTo(m_pengadaan_detail, { as: "id_mpd_m_pengadaan_detail", foreignKey: "id_mpd"});
  m_pengadaan_detail.hasMany(m_lelang, { as: "m_lelangs", foreignKey: "id_mpd"});
  m_ap.belongsTo(mitra, { as: "id_mitra_mitra", foreignKey: "id_mitra"});
  mitra.hasMany(m_ap, { as: "m_aps", foreignKey: "id_mitra"});
  m_collector_pembayaran_vendor.belongsTo(mitra, { as: "id_mitra_mitra", foreignKey: "id_mitra"});
  mitra.hasMany(m_collector_pembayaran_vendor, { as: "m_collector_pembayaran_vendors", foreignKey: "id_mitra"});
  m_lelang.belongsTo(mitra, { as: "id_mitra_mitra", foreignKey: "id_mitra"});
  mitra.hasMany(m_lelang, { as: "m_lelangs", foreignKey: "id_mitra"});

  return {
    act_acount,
    act_dept,
    act_gl,
    act_gl_detail,
    act_juornal_detail,
    act_pajak,
    act_pajak_pembatalan,
    act_sop,
    act_sop_lampiran,
    alamat,
    alamat_fee,
    alamat_fee_history,
    alamat_po,
    alamat_ritase,
    armada,
    armadaa,
    awb,
    bbm_price,
    berita,
    blog_article,
    blog_image,
    blog_partial,
    blog_partial_sub,
    blog_settings,
    cabang,
    chat,
    chat_driver,
    ci_sessions,
    collector_purchase_invoices,
    collector_purchase_payments,
    collector_purchase_payments_records,
    collector_receive_payment,
    collector_receive_payment_record,
    collector_sales_invoices,
    command_center_fcm_tokens,
    config,
    customer,
    customer_info,
    customer_npwp,
    customer_price,
    customer_policy,
    d_customer,
    dev_emc_address,
    dev_emc_order,
    dev_emc_order_detail,
    ebh_area,
    ebh_category_sub,
    ebh_category_utama,
    ebh_product,
    ebh_product_stock,
    emc_address,
    emc_chat,
    emc_city,
    emc_config,
    emc_cus,
    emc_customer,
    emc_customer_chat,
    emc_customer_company,
    emc_customer_log,
    emc_customer_referral,
    emc_customer_voucher,
    emc_driver,
    emc_driver_chat,
    emc_driver_chat_customer,
    emc_driver_claim_point,
    emc_driver_emergency,
    emc_driver_income,
    emc_driver_locations,
    emc_driver_order,
    emc_fees,
    emc_history_deposit,
    emc_history_payment,
    emc_jne_awb,
    emc_jne_city,
    emc_jne_kode,
    emc_jne_province,
    emc_jne_subdistrict,
    emc_jne_tarif,
    emc_latlon_sales,
    emc_login_history,
    emc_notifikasi,
    emc_order,
    emc_order_detail,
    emc_order_detailz,
    emc_order_invoice,
    emc_order_invoice_details,
    emc_order_logs,
    emc_order_payment,
    emc_order_status,
    emc_orderz,
    emc_promo,
    emc_promo_history,
    emc_province,
    emc_retail,
    emc_static,
    emc_status_master,
    emc_subdistrict,
    emc_temp,
    emc_uang_jalan,
    emc_uang_jalan_order,
    emcawb,
    emcfoto,
    emcstatus,
    emctracking,
    gps_event_logs,
    m_sm_retur_history,
    erl_brench,
    erl_brench_rep,
    history,
    history_pengiriman,
    invoice_customer,
    invoice_vendor,
    it_asset,
    it_asset_brand,
    it_asset_code,
    it_asset_history,
    it_asset_permintaan_inventaris,
    it_asset_permintaan_inventaris_spesifikasi,
    it_asset_serahterima,
    it_asset_spesifikasi,
    it_chat,
    it_helpdesk,
    it_helpdesk_comment,
    it_helpdesk_status,
    it_pengadaan_inventaris,
    it_pengajuan,
    it_performance_target,
    it_server,
    it_ticket,
    jenis_pengiriman,
    karyawan,
    kategori,
    kecamatan,
    kendaraan,
    kendaraan_check_master,
    kendaraan_jenis,
    kendaraan_jenis_race,
    kendaraan_kondisi,
    kendaraan_sewa_dedicated,
    kendaraanstatus,
    kendaraanstatusold,
    kota,
    kpu,
    kpu_dapil,
    laporan_elogs2021,
    laporan_elogs2022,
    laporan_elogs2023,
    laporan_race2021,
    laporan_race2022,
    laporan_race2023,
    m_ap,
    m_ap_biaya,
    m_ap_biaya_detail,
    m_ap_detail,
    m_ap_noar,
    m_ap_pengajuan,
    m_ap_pengajuan_detail,
    m_ap_personal,
    m_ap_personal_detail,
    m_ap_temp,
    m_ar,
    m_ar_addon,
    m_ar_addon_detail,
    m_ar_addon_type,
    m_ar_billing,
    m_ar_detail,
    m_ar_history,
    m_ar_payment,
    m_ar_payment_detail,
    m_ar_personal,
    m_ar_personal_detail,
    m_ar_real,
    m_bu,
    m_bu_brench,
    m_bu_employee,
    m_bu_employee_department,
    m_bu_employee_position,
    m_chat,
    m_chat_email,
    m_chat_internal,
    m_chat_internal_status,
    m_collector_agedhutang,
    m_collector_agedpiutang,
    m_collector_bank_keluar,
    m_collector_bank_masuk,
    m_collector_jenis_pembayaran_customer,
    m_collector_jenis_pembayaran_vendor,
    m_collector_pembayaran_customer,
    m_collector_pembayaran_customer_detail,
    m_collector_pembayaran_vendor,
    m_collector_pembayaran_vendor_detail,
    m_collector_uang_masuk,
    m_complaint,
    m_complaint_comment,
    m_complaint_type,
    m_customer,
    m_customer_chat,
    m_customer_claim_point,
    m_customer_record,
    m_driver,
    m_driver_chat,
    m_driver_claim_point,
    m_driver_emergency,
    m_driver_history_point,
    m_driver_info,
    m_driver_locations,
    m_driver_order,
    m_driver_perbaikan,
    m_driver_perbaikan_detail,
    m_foto,
    m_gps_record,
    m_history_berat,
    m_info,
    m_info_category,
    m_info_comment,
    m_karyawan,
    m_kota,
    m_laporan_emc,
    m_lelang,
    m_mastercollector_uang_masuk,
    m_mitra,
    m_notif,
    m_operasional_uang_jalan,
    m_operasional_uang_jalan_detail,
    m_ops_pengajuan_keur,
    m_ops_pengajuan_keur_detail,
    m_pengadaan,
    m_pengadaan_approve,
    m_pengadaan_comment,
    m_pengadaan_cus,
    m_pengadaan_detail,
    m_pengadaan_detail_cus,
    m_pengadaan_do,
    m_pengadaan_mitra,
    m_pengadaan_multimuat,
    m_pengadaan_race,
    m_pengajuan,
    m_pengajuan_biaya,
    m_pengajuan_catatan,
    m_pengajuan_driver,
    m_pengajuan_driver_trf,
    m_pengajuan_file,
    m_pengajuan_otorisasi,
    m_pengajuan_type,
    m_pengajuan_users,
    m_performance_aspek,
    m_performance_employee,
    m_performance_type,
    m_po,
    m_po_coment,
    m_po_detail,
    m_pool,
    pool_activity_log,
    m_promo,
    m_purch_invoice,
    m_purch_invoice_pembayaran,
    m_purch_unit,
    m_purch_unitpakai,
    m_questionnaire,
    m_req_asuransi,
    m_req_asuransi_detail,
    m_request_price,
    m_request_unit,
    m_ritase,
    m_shipment,
    m_sm,
    m_sm_diterima,
    m_sm_kondisi_barang,
    m_sm_photo,
    m_sm_real,
    m_sm_receive,
    m_sm_receive_check,
    m_sm_cost,
    m_sm_retur,
    m_sm_retur_detail,
    m_sm_status,
    m_sm_test,
    m_smu,
    m_status,
    m_status_chat,
    m_status_complaint,
    m_status_master,
    m_status_order,
    m_status_vehicle,
    m_target,
    m_tarif_customer,
    m_tarif_eureka,
    m_tarif_mitra,
    m_task,
    m_task_holiday,
    m_taskrespon,
    m_vehicle,
    m_vehicle_position,
    m_vehicle_status,
    m_voucher,
    m_wil_kecamatan,
    m_wil_kota,
    m_wil_provinsi,
    mainmenu,
    massage_do,
    mitra,
    mitra_chat,
    mitra_complaint,
    mitra_driver,
    mitra_fee,
    mitra_mail,
    mitra_md,
    mitra_md_cabang,
    mitra_md_kategori,
    mitra_md_pic,
    mitra_md_produk,
    mitra_norekcabang,
    mitra_pic,
    mitra_vehicle,
    modul,
    mp_customer,
    mp_customer_gak_pake,
    mp_jenis_barang,
    mp_muatan,
    mp_muatan_kiriman,
    mp_muatan_kiriman_detail,
    mp_muatan_order,
    mp_muatan_order_riwayat,
    mp_muatan_order_status,
    mp_notifikasi,
    mp_produk,
    mp_truk,
    mp_truk_kategori,
    mp_vendor,
    mp_vendor_truk,
    my_bank,
    n_customer,
    n_customer_chat,
    n_request,
    packing,
    pengadaan_unit,
    po_purchasing,
    pro_poposal_catatan,
    pro_proposal,
    pro_proposal_ttd,
    provinsi,
    push_notification,
    pw_harian,
    quot_ket,
    quot_tarif,
    race_ptj,
    reward,
    smstatus,
    spk,
    statistik,
    submenu,
    supirstatus,
    surat_muat,
    target_penjualan,
    tarif,
    tarif_customer,
    tarif_emc,
    tarif_erlangga,
    tarif_jne,
    tarif_non_erlangga,
    top,
    topstatus,
    traffic_customer,
    tsm,
    uang_jalan,
    uang_jalan_periode,
    uang_jalan_periode_detail,
    uang_jalan_ptj,
    uang_jalan_race,
    updt_total_mpd,
    usergroups,
    users,
    users_group,
    users_level,
    users_perusahaan,
    userslevel,
  wm_complaint,
  gps_geofence: _gps_geofence(sequelize),
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
