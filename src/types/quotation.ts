export interface QuotationData {
    key: string;
    quotationNumber: string;
    customerName: string;
    customerContact?: string;
    customerAddress?: string;
    amount: number;
    date: string;
    status: 'pending' | 'expired' | 'approved';
    description?: string;
    notes?: string;
}

export interface QuotationFormData {
    quotationNumber: string;
    customerName: string;
    customerContact?: string;
    customerAddress?: string;
    amount: number;
    date: string;
    status: 'pending' | 'expired' | 'approved';
    description?: string;
    notes?: string;
}

export const QUOTATION_STATUS = {
    PENDING: 'pending' as const,
    EXPIRED: 'expired' as const,
    APPROVED: 'approved' as const,
};

export const QUOTATION_STATUS_CONFIG = {
    [QUOTATION_STATUS.PENDING]: { color: 'orange', text: 'รออนุมัติ' },
    [QUOTATION_STATUS.EXPIRED]: { color: 'red', text: 'พ้นกำหนด' },
    [QUOTATION_STATUS.APPROVED]: { color: 'green', text: 'อนุมัติแล้ว' },
};
