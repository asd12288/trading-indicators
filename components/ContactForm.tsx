
const ContactForm = () => {
  return (
    <form
      action="/"
      className="w-[450px] space-y-4 rounded-lg bg-slate-800 p-8"
    >
      <div className="flex flex-col gap-2">
        <label>Name</label>
        <input
          className="rounded-md px-2 py-2 text-slate-950 placeholder:text-slate-600"
          type="text"
          placeholder="Name"
          defaultValue=""
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Email</label>

        <input
          className="rounded-md px-2 py-2 text-slate-950 placeholder:text-slate-600"
          type="email"
          placeholder="Email"
          defaultValue=""
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>What is your Profession?</label>
        <select
          defaultValue="trader"
          className="rounded-md py-2 text-slate-950"
        >
          <option value="trader">Trader</option>
          <option value="student">Im learning</option>
          <option value="tutor">Tutor</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 rounded-md">
        <label>Message</label>
        <textarea
          className="mb-4 rounded-md px-2 py-2 text-slate-950 placeholder:text-slate-600"
          id="message"
          placeholder="Message"
          defaultValue=""
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-green-600 px-6 py-3 text-white"
      >
        Send
      </button>
    </form>
  );
};

export default ContactForm;
