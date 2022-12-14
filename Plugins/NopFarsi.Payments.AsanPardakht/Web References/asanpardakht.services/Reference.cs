//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// 
// This source code was auto-generated by Microsoft.VSDesigner, Version 4.0.30319.42000.
// 
#pragma warning disable 1591

namespace NopFarsi.Payments.AsanPardakht.asanpardakht.services {
    using System;
    using System.Web.Services;
    using System.Diagnostics;
    using System.Web.Services.Protocols;
    using System.Xml.Serialization;
    using System.ComponentModel;
    
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Web.Services.WebServiceBindingAttribute(Name="merchantservicesSoap", Namespace="http://tempuri.org/")]
    public partial class merchantservices : System.Web.Services.Protocols.SoapHttpClientProtocol {
        
        private System.Threading.SendOrPostCallback RequestOperationOperationCompleted;
        
        private System.Threading.SendOrPostCallback RequestReconciliationOperationCompleted;
        
        private System.Threading.SendOrPostCallback RequestVerificationOperationCompleted;
        
        private System.Threading.SendOrPostCallback CancellVerificationOperationCompleted;
        
        private System.Threading.SendOrPostCallback RequestReversalOperationCompleted;
        
        private System.Threading.SendOrPostCallback TrxStatusFromLocalInvoiceIDOperationCompleted;
        
        private bool useDefaultCredentialsSetExplicitly;
        
        /// <remarks/>
        public merchantservices() {
            this.Url = global::NopFarsi.Payments.AsanPardakht.Properties.Settings.Default.NopFarsi_Payments_AsanPardakht_asanpardakht_services_merchantservices;
            if ((this.IsLocalFileSystemWebService(this.Url) == true)) {
                this.UseDefaultCredentials = true;
                this.useDefaultCredentialsSetExplicitly = false;
            }
            else {
                this.useDefaultCredentialsSetExplicitly = true;
            }
        }
        
        public new string Url {
            get {
                return base.Url;
            }
            set {
                if ((((this.IsLocalFileSystemWebService(base.Url) == true) 
                            && (this.useDefaultCredentialsSetExplicitly == false)) 
                            && (this.IsLocalFileSystemWebService(value) == false))) {
                    base.UseDefaultCredentials = false;
                }
                base.Url = value;
            }
        }
        
        public new bool UseDefaultCredentials {
            get {
                return base.UseDefaultCredentials;
            }
            set {
                base.UseDefaultCredentials = value;
                this.useDefaultCredentialsSetExplicitly = true;
            }
        }
        
        /// <remarks/>
        public event RequestOperationCompletedEventHandler RequestOperationCompleted;
        
        /// <remarks/>
        public event RequestReconciliationCompletedEventHandler RequestReconciliationCompleted;
        
        /// <remarks/>
        public event RequestVerificationCompletedEventHandler RequestVerificationCompleted;
        
        /// <remarks/>
        public event CancellVerificationCompletedEventHandler CancellVerificationCompleted;
        
        /// <remarks/>
        public event RequestReversalCompletedEventHandler RequestReversalCompleted;
        
        /// <remarks/>
        public event TrxStatusFromLocalInvoiceIDCompletedEventHandler TrxStatusFromLocalInvoiceIDCompleted;
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/RequestOperation", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        public string RequestOperation(int merchantConfigurationID, string encryptedRequest) {
            object[] results = this.Invoke("RequestOperation", new object[] {
                        merchantConfigurationID,
                        encryptedRequest});
            return ((string)(results[0]));
        }
        
        /// <remarks/>
        public void RequestOperationAsync(int merchantConfigurationID, string encryptedRequest) {
            this.RequestOperationAsync(merchantConfigurationID, encryptedRequest, null);
        }
        
        /// <remarks/>
        public void RequestOperationAsync(int merchantConfigurationID, string encryptedRequest, object userState) {
            if ((this.RequestOperationOperationCompleted == null)) {
                this.RequestOperationOperationCompleted = new System.Threading.SendOrPostCallback(this.OnRequestOperationOperationCompleted);
            }
            this.InvokeAsync("RequestOperation", new object[] {
                        merchantConfigurationID,
                        encryptedRequest}, this.RequestOperationOperationCompleted, userState);
        }
        
        private void OnRequestOperationOperationCompleted(object arg) {
            if ((this.RequestOperationCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.RequestOperationCompleted(this, new RequestOperationCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/RequestReconciliation", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        public string RequestReconciliation(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID) {
            object[] results = this.Invoke("RequestReconciliation", new object[] {
                        merchantConfigurationID,
                        encryptedCredentials,
                        payGateTranID});
            return ((string)(results[0]));
        }
        
        /// <remarks/>
        public void RequestReconciliationAsync(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID) {
            this.RequestReconciliationAsync(merchantConfigurationID, encryptedCredentials, payGateTranID, null);
        }
        
        /// <remarks/>
        public void RequestReconciliationAsync(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID, object userState) {
            if ((this.RequestReconciliationOperationCompleted == null)) {
                this.RequestReconciliationOperationCompleted = new System.Threading.SendOrPostCallback(this.OnRequestReconciliationOperationCompleted);
            }
            this.InvokeAsync("RequestReconciliation", new object[] {
                        merchantConfigurationID,
                        encryptedCredentials,
                        payGateTranID}, this.RequestReconciliationOperationCompleted, userState);
        }
        
        private void OnRequestReconciliationOperationCompleted(object arg) {
            if ((this.RequestReconciliationCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.RequestReconciliationCompleted(this, new RequestReconciliationCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/RequestVerification", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        public string RequestVerification(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID) {
            object[] results = this.Invoke("RequestVerification", new object[] {
                        merchantConfigurationID,
                        encryptedCredentials,
                        payGateTranID});
            return ((string)(results[0]));
        }
        
        /// <remarks/>
        public void RequestVerificationAsync(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID) {
            this.RequestVerificationAsync(merchantConfigurationID, encryptedCredentials, payGateTranID, null);
        }
        
        /// <remarks/>
        public void RequestVerificationAsync(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID, object userState) {
            if ((this.RequestVerificationOperationCompleted == null)) {
                this.RequestVerificationOperationCompleted = new System.Threading.SendOrPostCallback(this.OnRequestVerificationOperationCompleted);
            }
            this.InvokeAsync("RequestVerification", new object[] {
                        merchantConfigurationID,
                        encryptedCredentials,
                        payGateTranID}, this.RequestVerificationOperationCompleted, userState);
        }
        
        private void OnRequestVerificationOperationCompleted(object arg) {
            if ((this.RequestVerificationCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.RequestVerificationCompleted(this, new RequestVerificationCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/CancellVerification", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        public string CancellVerification(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID) {
            object[] results = this.Invoke("CancellVerification", new object[] {
                        merchantConfigurationID,
                        encryptedCredentials,
                        payGateTranID});
            return ((string)(results[0]));
        }
        
        /// <remarks/>
        public void CancellVerificationAsync(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID) {
            this.CancellVerificationAsync(merchantConfigurationID, encryptedCredentials, payGateTranID, null);
        }
        
        /// <remarks/>
        public void CancellVerificationAsync(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID, object userState) {
            if ((this.CancellVerificationOperationCompleted == null)) {
                this.CancellVerificationOperationCompleted = new System.Threading.SendOrPostCallback(this.OnCancellVerificationOperationCompleted);
            }
            this.InvokeAsync("CancellVerification", new object[] {
                        merchantConfigurationID,
                        encryptedCredentials,
                        payGateTranID}, this.CancellVerificationOperationCompleted, userState);
        }
        
        private void OnCancellVerificationOperationCompleted(object arg) {
            if ((this.CancellVerificationCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.CancellVerificationCompleted(this, new CancellVerificationCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/RequestReversal", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        public string RequestReversal(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID) {
            object[] results = this.Invoke("RequestReversal", new object[] {
                        merchantConfigurationID,
                        encryptedCredentials,
                        payGateTranID});
            return ((string)(results[0]));
        }
        
        /// <remarks/>
        public void RequestReversalAsync(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID) {
            this.RequestReversalAsync(merchantConfigurationID, encryptedCredentials, payGateTranID, null);
        }
        
        /// <remarks/>
        public void RequestReversalAsync(int merchantConfigurationID, string encryptedCredentials, ulong payGateTranID, object userState) {
            if ((this.RequestReversalOperationCompleted == null)) {
                this.RequestReversalOperationCompleted = new System.Threading.SendOrPostCallback(this.OnRequestReversalOperationCompleted);
            }
            this.InvokeAsync("RequestReversal", new object[] {
                        merchantConfigurationID,
                        encryptedCredentials,
                        payGateTranID}, this.RequestReversalOperationCompleted, userState);
        }
        
        private void OnRequestReversalOperationCompleted(object arg) {
            if ((this.RequestReversalCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.RequestReversalCompleted(this, new RequestReversalCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/TrxStatusFromLocalInvoiceID", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        public TransactionDataPackage TrxStatusFromLocalInvoiceID(int merchantConfigurationID, string encryptedCredintials, long localInvoiceID) {
            object[] results = this.Invoke("TrxStatusFromLocalInvoiceID", new object[] {
                        merchantConfigurationID,
                        encryptedCredintials,
                        localInvoiceID});
            return ((TransactionDataPackage)(results[0]));
        }
        
        /// <remarks/>
        public void TrxStatusFromLocalInvoiceIDAsync(int merchantConfigurationID, string encryptedCredintials, long localInvoiceID) {
            this.TrxStatusFromLocalInvoiceIDAsync(merchantConfigurationID, encryptedCredintials, localInvoiceID, null);
        }
        
        /// <remarks/>
        public void TrxStatusFromLocalInvoiceIDAsync(int merchantConfigurationID, string encryptedCredintials, long localInvoiceID, object userState) {
            if ((this.TrxStatusFromLocalInvoiceIDOperationCompleted == null)) {
                this.TrxStatusFromLocalInvoiceIDOperationCompleted = new System.Threading.SendOrPostCallback(this.OnTrxStatusFromLocalInvoiceIDOperationCompleted);
            }
            this.InvokeAsync("TrxStatusFromLocalInvoiceID", new object[] {
                        merchantConfigurationID,
                        encryptedCredintials,
                        localInvoiceID}, this.TrxStatusFromLocalInvoiceIDOperationCompleted, userState);
        }
        
        private void OnTrxStatusFromLocalInvoiceIDOperationCompleted(object arg) {
            if ((this.TrxStatusFromLocalInvoiceIDCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.TrxStatusFromLocalInvoiceIDCompleted(this, new TrxStatusFromLocalInvoiceIDCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        public new void CancelAsync(object userState) {
            base.CancelAsync(userState);
        }
        
        private bool IsLocalFileSystemWebService(string url) {
            if (((url == null) 
                        || (url == string.Empty))) {
                return false;
            }
            System.Uri wsUri = new System.Uri(url);
            if (((wsUri.Port >= 1024) 
                        && (string.Compare(wsUri.Host, "localHost", System.StringComparison.OrdinalIgnoreCase) == 0))) {
                return true;
            }
            return false;
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.7.2558.0")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://tempuri.org/")]
    public partial class TransactionDataPackage {
        
        private int fetchResultField;
        
        private System.DateTime reportDateField;
        
        private TransactionStatus[] transactionListField;
        
        /// <remarks/>
        public int FetchResult {
            get {
                return this.fetchResultField;
            }
            set {
                this.fetchResultField = value;
            }
        }
        
        /// <remarks/>
        public System.DateTime ReportDate {
            get {
                return this.reportDateField;
            }
            set {
                this.reportDateField = value;
            }
        }
        
        /// <remarks/>
        public TransactionStatus[] TransactionList {
            get {
                return this.transactionListField;
            }
            set {
                this.transactionListField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.7.2558.0")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://tempuri.org/")]
    public partial class TransactionStatus {
        
        private int eMerchantConfigIDField;
        
        private long localInvoiceIDField;
        
        private System.DateTime operationRequestDateField;
        
        private System.DateTime merchantLocalDateField;
        
        private long requestedAmountInRialsField;
        
        private string additionalDataField;
        
        private int serviceTypeIDField;
        
        private string callbackURLField;
        
        private string payerIDField;
        
        private string tokenField;
        
        private long payGateTranIDField;
        
        private System.DateTime transactionDateField;
        
        private string cardNumberField;
        
        private int stanField;
        
        private long actualTrxAmountField;
        
        private string billIDField;
        
        private string paymentIDField;
        
        private string trxResultCodeField;
        
        private bool mainTrxWasSuccessfulField;
        
        private string rRNField;
        
        private bool isVerifiedField;
        
        private System.Nullable<System.DateTime> verifyRequestDateField;
        
        private bool reconcilationSucceededField;
        
        private System.Nullable<System.DateTime> reconcilationRequestDateField;
        
        private bool isReconcilationRequestedAutomaticallyField;
        
        private System.Nullable<System.DateTime> reconcilationTryDateField;
        
        private bool reversalSucceededField;
        
        private System.Nullable<System.DateTime> reversalRequestDateField;
        
        private bool isReversalRequestedAutomaticallyField;
        
        private System.Nullable<System.DateTime> reversalTryDateField;
        
        /// <remarks/>
        public int EMerchantConfigID {
            get {
                return this.eMerchantConfigIDField;
            }
            set {
                this.eMerchantConfigIDField = value;
            }
        }
        
        /// <remarks/>
        public long LocalInvoiceID {
            get {
                return this.localInvoiceIDField;
            }
            set {
                this.localInvoiceIDField = value;
            }
        }
        
        /// <remarks/>
        public System.DateTime OperationRequestDate {
            get {
                return this.operationRequestDateField;
            }
            set {
                this.operationRequestDateField = value;
            }
        }
        
        /// <remarks/>
        public System.DateTime MerchantLocalDate {
            get {
                return this.merchantLocalDateField;
            }
            set {
                this.merchantLocalDateField = value;
            }
        }
        
        /// <remarks/>
        public long RequestedAmountInRials {
            get {
                return this.requestedAmountInRialsField;
            }
            set {
                this.requestedAmountInRialsField = value;
            }
        }
        
        /// <remarks/>
        public string AdditionalData {
            get {
                return this.additionalDataField;
            }
            set {
                this.additionalDataField = value;
            }
        }
        
        /// <remarks/>
        public int ServiceTypeID {
            get {
                return this.serviceTypeIDField;
            }
            set {
                this.serviceTypeIDField = value;
            }
        }
        
        /// <remarks/>
        public string CallbackURL {
            get {
                return this.callbackURLField;
            }
            set {
                this.callbackURLField = value;
            }
        }
        
        /// <remarks/>
        public string PayerID {
            get {
                return this.payerIDField;
            }
            set {
                this.payerIDField = value;
            }
        }
        
        /// <remarks/>
        public string Token {
            get {
                return this.tokenField;
            }
            set {
                this.tokenField = value;
            }
        }
        
        /// <remarks/>
        public long PayGateTranID {
            get {
                return this.payGateTranIDField;
            }
            set {
                this.payGateTranIDField = value;
            }
        }
        
        /// <remarks/>
        public System.DateTime TransactionDate {
            get {
                return this.transactionDateField;
            }
            set {
                this.transactionDateField = value;
            }
        }
        
        /// <remarks/>
        public string CardNumber {
            get {
                return this.cardNumberField;
            }
            set {
                this.cardNumberField = value;
            }
        }
        
        /// <remarks/>
        public int Stan {
            get {
                return this.stanField;
            }
            set {
                this.stanField = value;
            }
        }
        
        /// <remarks/>
        public long ActualTrxAmount {
            get {
                return this.actualTrxAmountField;
            }
            set {
                this.actualTrxAmountField = value;
            }
        }
        
        /// <remarks/>
        public string BillID {
            get {
                return this.billIDField;
            }
            set {
                this.billIDField = value;
            }
        }
        
        /// <remarks/>
        public string PaymentID {
            get {
                return this.paymentIDField;
            }
            set {
                this.paymentIDField = value;
            }
        }
        
        /// <remarks/>
        public string TrxResultCode {
            get {
                return this.trxResultCodeField;
            }
            set {
                this.trxResultCodeField = value;
            }
        }
        
        /// <remarks/>
        public bool MainTrxWasSuccessful {
            get {
                return this.mainTrxWasSuccessfulField;
            }
            set {
                this.mainTrxWasSuccessfulField = value;
            }
        }
        
        /// <remarks/>
        public string RRN {
            get {
                return this.rRNField;
            }
            set {
                this.rRNField = value;
            }
        }
        
        /// <remarks/>
        public bool IsVerified {
            get {
                return this.isVerifiedField;
            }
            set {
                this.isVerifiedField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public System.Nullable<System.DateTime> VerifyRequestDate {
            get {
                return this.verifyRequestDateField;
            }
            set {
                this.verifyRequestDateField = value;
            }
        }
        
        /// <remarks/>
        public bool ReconcilationSucceeded {
            get {
                return this.reconcilationSucceededField;
            }
            set {
                this.reconcilationSucceededField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public System.Nullable<System.DateTime> ReconcilationRequestDate {
            get {
                return this.reconcilationRequestDateField;
            }
            set {
                this.reconcilationRequestDateField = value;
            }
        }
        
        /// <remarks/>
        public bool IsReconcilationRequestedAutomatically {
            get {
                return this.isReconcilationRequestedAutomaticallyField;
            }
            set {
                this.isReconcilationRequestedAutomaticallyField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public System.Nullable<System.DateTime> ReconcilationTryDate {
            get {
                return this.reconcilationTryDateField;
            }
            set {
                this.reconcilationTryDateField = value;
            }
        }
        
        /// <remarks/>
        public bool ReversalSucceeded {
            get {
                return this.reversalSucceededField;
            }
            set {
                this.reversalSucceededField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public System.Nullable<System.DateTime> ReversalRequestDate {
            get {
                return this.reversalRequestDateField;
            }
            set {
                this.reversalRequestDateField = value;
            }
        }
        
        /// <remarks/>
        public bool IsReversalRequestedAutomatically {
            get {
                return this.isReversalRequestedAutomaticallyField;
            }
            set {
                this.isReversalRequestedAutomaticallyField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public System.Nullable<System.DateTime> ReversalTryDate {
            get {
                return this.reversalTryDateField;
            }
            set {
                this.reversalTryDateField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    public delegate void RequestOperationCompletedEventHandler(object sender, RequestOperationCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class RequestOperationCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal RequestOperationCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public string Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((string)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    public delegate void RequestReconciliationCompletedEventHandler(object sender, RequestReconciliationCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class RequestReconciliationCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal RequestReconciliationCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public string Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((string)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    public delegate void RequestVerificationCompletedEventHandler(object sender, RequestVerificationCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class RequestVerificationCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal RequestVerificationCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public string Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((string)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    public delegate void CancellVerificationCompletedEventHandler(object sender, CancellVerificationCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class CancellVerificationCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal CancellVerificationCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public string Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((string)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    public delegate void RequestReversalCompletedEventHandler(object sender, RequestReversalCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class RequestReversalCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal RequestReversalCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public string Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((string)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    public delegate void TrxStatusFromLocalInvoiceIDCompletedEventHandler(object sender, TrxStatusFromLocalInvoiceIDCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.7.2558.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class TrxStatusFromLocalInvoiceIDCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal TrxStatusFromLocalInvoiceIDCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public TransactionDataPackage Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((TransactionDataPackage)(this.results[0]));
            }
        }
    }
}

#pragma warning restore 1591