namespace ExpenseView.Service.DataAccessor
{
    /// <summary>
    /// Summary description for TransactionResult
    /// </summary>
    public class AccessorResult
    {
        public const int FAILED_TRANSACTION = -1;
        public const int NONUNIQUE_RECORD_ERROR = 2627;
        public const int SUCCESS_TRANSACTION = 1;

        private readonly int _resultCode;

        public AccessorResult(int resultCode)
        {
            _resultCode = resultCode;
        }

        public bool IsSuccess()
        {
            return (_resultCode == SUCCESS_TRANSACTION);
        }

        public bool IsFailure()
        {
            return (_resultCode == FAILED_TRANSACTION);
        }

        public bool IsError()
        {
            return ((_resultCode != FAILED_TRANSACTION) || (_resultCode != SUCCESS_TRANSACTION));
        }

        public bool IsNonUniqueError()
        {
            return (_resultCode == NONUNIQUE_RECORD_ERROR);
        }
    }
}