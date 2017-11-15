using System;

namespace Huddle.BotWebApp.Dialogs
{
    [Serializable]
    public class SignTimeoutException : TimeoutException
    {
        public SignTimeoutException() { }
        public SignTimeoutException(string message) : base(message) { }
        public SignTimeoutException(string message, Exception inner) : base(message, inner) { }
        protected SignTimeoutException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }

    [Serializable]
    public class ActionCancelledException : Exception
    {
        public ActionCancelledException() { }
        public ActionCancelledException(string message) : base(message) { }
        public ActionCancelledException(string message, Exception inner) : base(message, inner) { }
        protected ActionCancelledException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }
}