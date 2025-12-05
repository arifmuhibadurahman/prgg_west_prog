import mongoose, { Schema } from "mongoose";

const KunjunganSchema = new Schema(
  {
    kecamatan: { type: String, required: true },
    jumlah: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Kunjungan ||
  mongoose.model("Kunjungan", KunjunganSchema);
