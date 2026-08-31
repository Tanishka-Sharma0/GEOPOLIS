export default function ClayPanel({children, className=''}:{children:any,className?:string}){
 return <div className={`bg-[#E8DCCF] border border-[#CBB9A6] ${className}`}>{children}</div>
}
