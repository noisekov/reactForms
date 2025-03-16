import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './FormControl.module.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { addData } from '../../features/dataSlice';
import { useNavigate } from 'react-router-dom';

interface IFormData {
  name: string;
  age: number;
  email: string;
  password: string;
  repeatPassword: string;
  sex: string;
  terms: boolean;
  country: string;
  image: FileList | ArrayBuffer | null | string;
}

const FILE_SIZE_LIMIT = 1024 * 1024; // 1MB
const SPECIAL_CHARS = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
const hasNumber = /\d/;
const hasUppercase = /[A-Z]/;
const hasLowercase = /[a-z]/;
const hasSpecialChar = new RegExp(
  `[${SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`
);

const formValidation = z
  .object({
    name: z
      .string()
      .min(1, { message: 'First letter must be uppercased' })
      .refine((val) => val[0] === val[0]?.toUpperCase(), {
        message: `First letter must be uppercased`,
      }),
    age: z.preprocess(
      (val) => +z.string().parse(val),
      z.number().positive('No negative values')
    ),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .refine((password) => hasNumber.test(password), {
        message: 'Password must contain at least 1 number',
      })
      .refine((password) => hasUppercase.test(password), {
        message: 'Password must contain at least 1 uppercase letter',
      })
      .refine((password) => hasLowercase.test(password), {
        message: 'Password must contain at least 1 lowercase letter',
      })
      .refine((password) => hasSpecialChar.test(password), {
        message: `Must contain special character: ${SPECIAL_CHARS}`,
      }),
    repeatPassword: z.string(),
    sex: z.string().refine((val) => val !== 'choose', {
      message: `Choose gender`,
    }),
    terms: z.boolean().refine((val) => val === true, {
      message: `Accept terms`,
    }),
    image: z
      .union([
        z.string(),
        z.instanceof(FileList),
        z.instanceof(ArrayBuffer),
        z.null(),
      ])
      .refine(
        (files) => {
          if (!(files instanceof FileList)) return true;

          return files.length > 0;
        },
        {
          message: 'No files selected',
        }
      )
      .refine(
        (file) => {
          if (!(file instanceof FileList)) return true;

          return ['image/png', 'image/jpeg'].includes(file[0]?.type);
        },
        {
          message: 'Invalid image file type',
        }
      )
      .refine(
        (file) => {
          if (!(file instanceof FileList)) return true;

          return file[0]?.size <= FILE_SIZE_LIMIT;
        },
        {
          message: 'File size should not exceed 1MB',
        }
      ),
    country: z.string().refine((val) => !!val, {
      message: `Choose country`,
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'],
  });

const readFileAsBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function FormControl() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(formValidation),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    if (data.image instanceof FileList) {
      const file = data.image[0];

      if (file && file instanceof File) {
        const base64String = await readFileAsBase64(file);
        data.image = base64String;
      }
    }

    dispatch(addData(data));
    navigate('/reactForms');
  };

  return (
    <div>
      <p>Form Control</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input placeholder="Name" {...register('name')} />
        <output className={styles.error}>{errors.name?.message}</output>
        <input type="number" placeholder="Age" {...register('age')} />
        <output className={styles.error}>{errors.age?.message}</output>
        <input type="email" placeholder="Email" {...register('email')} />
        <output className={styles.error}>{errors.email?.message}</output>
        <input
          type="password"
          placeholder="Password"
          {...register('password')}
        />
        <output className={styles.error}>{errors.password?.message}</output>
        <input
          type="password"
          placeholder="Repeat password"
          {...register('repeatPassword')}
        />
        <output className={styles.error}>
          {errors.repeatPassword?.message}
        </output>
        <select {...register('sex')}>
          <option value="choose">-- Choose gender --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <output className={styles.error}>{errors.sex?.message}</output>
        <label className={styles.label}>
          <input type="checkbox" {...register('terms')} />
          Accept terms and conditions agreement
        </label>
        <output className={styles.error}>{errors.terms?.message}</output>
        <input {...register('image')} type="file" />
        <output className={styles.error}>{errors.image?.message}</output>
        <label className={styles.label}>
          <input type="text" list="countries" {...register('country')} />
          Country
          <datalist id="countries">
            {['Ukraine', 'Russia', 'Belarus', 'Poland', 'Germany'].map(
              (country, index) => (
                <option key={index} value={country} />
              )
            )}
          </datalist>
        </label>
        <output className={styles.error}>{errors.country?.message}</output>
        <button className={styles.button} name="submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
