import Editor from '@/components/Editor';
import { TitleInput } from '@/components/TitleInput';
import { UseCurrentUsetStore } from '@/modules/auth/corrent-user.state';
import { noteRepository } from '@/modules/notes/note.repository';
import { useNoteStore } from '@/modules/notes/note.state';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const NoteDetail = () => {
  const params = useParams();
  const id = parseInt(params.id!);
  const [isLoading,setIsLoading] = useState(false);
  const {currentUser} = UseCurrentUsetStore();
  const noteStore = useNoteStore();
  const note = noteStore.getOne(id);


  useEffect(() =>{
    fetchOne();
  },[id]);
  const fetchOne = async () =>{
    setIsLoading(true);
    const note = await noteRepository.findOne(currentUser!.id,id);
    if(note  == null)return;
    noteStore.set([note]);
    setIsLoading(false);
  };

  const updateNote = async (
    id:number,
    note:{title?:string;content?: string})=>{
      const updateedNote = await noteRepository.update(id,note);
      if(updateNote == null)return;
      noteStore.set([updateedNote]);
      return updateedNote;
    };

  if(isLoading) return <div></div>
  if(note == null ) return <div>note is not existed</div>
  console.log(note);
  return (
    <div className="pb-40 pt-20">
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <TitleInput initialData={note} 
        onTitleChange={(title)=>updateNote(id,{title})}/>
        <Editor 
        initialContent={note.content}
        onChange={(content)=> updateNote(id,{content})}>

        </Editor>
      </div>
    </div>
  );
};

export default NoteDetail;
