import Model from '@/core/model';
import ApiService from '@/core/api.service';
import Collection from '@/core/collection';
import Order from '@/models/order/order';
import Store from '@/models/stores/stores';
import User from '@/models/user/user';
import TypeCollectVouchers from '@/models/type-collect-vouchers/type_collect_vouchers';
import TypePaymentVouchers from './type_payment_vouchers';
class ReceiptVouchers extends Model {
    constructor(data) {
        super();

        this.id = null;
        this.store_id = null;
        this.code = null;
        this.customer_id = null;
        this.order_id = null;
        this.is_active = null;
        this.invoice_id = null;
        this.amount = null;
        this.note = null;
        this.description = null;
        this.type_object = null;
        this.type_voucher = null;
        this.type_collect_voucher_id = null;
        this.confirmed_at = null;
        this.created_by = null;
        this.updated_by = null;
        this.created_at = null;
        this.updated_at = null;
        this.deleted_at = null;

        this.orders = new Collection(Order);
        this.type_collect_voucher = new TypeCollectVouchers();
        this.type_payment_voucher = new TypePaymentVouchers();
        this.store = new Store();
        this.user_create = new User();

        this.bind(data);
    }

    typeOfNumber() {
        return [
            'id',
            'store_id',
            'customer_id',
            'order_id',
            'invoice_id',
            'amount',
            'created_by',
            'updated_by',
            'type_collect_voucher_id',
        ];
    }

    /**
     * { function_description }
     *
     * @return     {Object}
     */
    typesOfDocument() {
        return { TIEN_MAT: 'tien_mat', SO_PHU_NGAN_HANG: 'so_phu_ngan_hang' };
    }

    /**
     * { function_description }
     *
     * @param      {<type>}  [type=null]  The type
     * @return     {Object}
     */
    typeNamesOfDocument() {
        return {
            [this.typesOfDocument().TIEN_MAT]: 'Phi???u thu',
            [this.typesOfDocument().SO_PHU_NGAN_HANG]: 'S??? ph??? ng??n h??ng',
        };
    }

    /**
     * { function_description }
     *
     * @param      {<type>}  [status=null]  The status
     * @return     {<type>}
     */
    typeNameOfDocument(type = null) {
        return this.typeNamesOfDocument()[type || this.type_voucher];
    }

    /**
     * { function_description }
     *
     * @return     {Object}
     */
    typeObjects() {
        return {
            KHACH_LE: 'KHACH_LE',
            KHACH_BUON: 'KHACH_BUON',
            NHA_CUNG_CAP: 'NHA_CUNG_CAP',
            DOI_TAC_VAN_CHUYEN: 'DOI_TAC_VAN_CHUYEN',
            NHAN_VIEN: 'NHAN_VIEN',
            KHAC: 'KHAC',
        };
    }

    /**
     * Determines if khach le.
     *
     * @return     {boolean}  True if khach le, False otherwise.
     */
    isTypeOpjectKhachLe() {
        return this.type_object === this.typeObjects().KHACH_LE;
    }

    /**
     * Determines if khach buon.
     *
     * @return     {boolean}  True if khach buon, False otherwise.
     */
    isTypeOpjectKhachBuon() {
        return this.type_object === this.typeObjects().KHACH_BUON;
    }

    /**
     * Determines if nha cung capability.
     *
     * @return     {boolean}  True if nha cung capability, False otherwise.
     */
    isTypeOpjectNhaCungCap() {
        return this.type_object === this.typeObjects().NHA_CUNG_CAP;
    }

    /**
     * Determines if doi tac van chuyen.
     *
     * @return     {boolean}  True if doi tac van chuyen, False otherwise.
     */
    isTypeOpjectDoiTacVanChuyen() {
        return this.type_object === this.typeObjects().DOI_TAC_VAN_CHUYEN;
    }

    /**
     * Determines if nhan vien.
     *
     * @return     {boolean}  True if nhan vien, False otherwise.
     */
    isTypeOpjectNhanVien() {
        return this.type_object === this.typeObjects().NHAN_VIEN;
    }

    isTypeOpjectKhac() {
        return this.type_object === this.typeObjects().KHAC;
    }

    /**
     * { function_description }
     *
     * @param      {<type>}  [type=null]  The type
     * @return     {Object}
     */
    typeObjectNames() {
        return {
            [this.typeObjects().KHACH_LE]: 'Kh??ch l???',
            [this.typeObjects().KHACH_BUON]: 'Kh??ch bu??n',
            [this.typeObjects().NHA_CUNG_CAP]: 'Nh?? cung c???p',
            [this.typeObjects().DOI_TAC_VAN_CHUYEN]: '?????i t??c v???n chuy???n',
            [this.typeObjects().NHAN_VIEN]: 'Nh??n vi??n',
            [this.typeObjects().KHAC]: '?????i t?????ng kh??c',
        };
    }

    /**
     * { function_description }
     *
     * @param      {<type>}  [status=null]  The status
     * @return     {<type>}
     */
    typeObjectName(type_object = null) {
        return this.typeObjectNames()[type_object || this.type_object];
    }

    /**
     * Tr???ng th??i
     *
     * @return     {Object}
     */
    status() {
        return {
            HOAN_THANH: 1,
            HUY: 0,
        };
    }

    /**
     * T??n c??c tr???ng th??i
     *
     * @return     {Object}
     */
    statusNames() {
        return {
            [this.status().HOAN_THANH]: 'Ho??n th??nh',
            [this.status().HUY]: 'H???y',
        };
    }

    /**
     * T??n c???a tr???ng th??i
     *
     * @param      {boolean}  is_active  Indicates if active
     * @return     {<type>}
     */
    statusName(is_active) {
        return this.statusNames()[is_active || this.is_active];
    }

    /**
     * { function_description }
     *
     * @return     {string}
     */
    apiGroup() {
        return 'receipt-vouchers';
    }

    /**
     * Gets the order payments.
     *
     * @param      {<type>}   params  The parameters
     * @return     {Promise}  The order payments.
     */
    async getOrderPayments(params) {
        return await ApiService.getAsync(this.URL('get-order'), params);
    }

    async autoGenerate(params) {
        return await ApiService.postAsync(this.URL('auto-generate'), params);
    }
}

export default ReceiptVouchers;
